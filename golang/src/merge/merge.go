package merge

import "bufio"
import "fmt"
import "os"
import "regexp"
import "strconv"
import "strings"

func readFileWithPrefixMatch(done <-chan struct{}, fileName string, pattern string, out chan<- string) {
	file, _ := os.Open(fileName)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		var line = scanner.Text()
		if matched, _ := regexp.MatchString("^"+pattern, line); matched {
			line = strings.TrimPrefix(line, pattern)
			select {
			case <-done:
				break
			case out <- line:
			}
		}
	}
	close(out)
	return
}

func readNumber(fileName string, pattern string) int {
	ch := make(chan string)
	done := make(chan struct{})
	defer close(done)
	go readFileWithPrefixMatch(done, fileName, pattern, ch)
	line := <-ch
	number, _ := strconv.Atoi(line)
	return number
}

func readNumberList(done <-chan struct{}, fileName string, pattern string, out chan<- int) {
	ch := make(chan string)
	go readFileWithPrefixMatch(done, fileName, pattern, ch)
loop:
	for line := range ch {
		ch1 := make(chan string)
		go lazySplit(done, line, ",", ch1)
		for s := range ch1 {
			number, _ := strconv.Atoi(s)
			select {
			case <-done:
				break loop
			case out <- number:
			}
		}

	}
	close(out)
	return
}

func getNumber(fileName string) int {
	return readNumber(fileName, "NUMBER=")
}

func getOutput(done <-chan struct{}, fileName string, out chan<- int) {
	readNumberList(done, fileName, "OUTPUT:", out)
	return
}

func lazySplit(done <-chan struct{}, s, sep string, out chan<- string) {
	for {
		select {
		case <-done:
			break
		default:
		}
		idx := strings.Index(s, sep)
		if idx == -1 {
			out <- s
			break
		}
		out <- s[0:idx]
		s = s[idx+1:]
	}
	close(out)
	return
}

func findMin(numbers []*int) (minIdx int) {
	minIdx = -1
	for idx, number := range numbers {
		if number != nil {
			if minIdx == -1 || *numbers[minIdx] > *number {
				minIdx = idx
			}
		}
	}
	return
}

func Merge(done <-chan struct{}, fileName string, out chan<- int) {
	number := getNumber(fileName)
	channels := make([]chan int, number)
	for i := 0; i < number; i++ {
		pattern := fmt.Sprintf("COLLECTION%d:", i)
		ch := make(chan int)
		go readNumberList(done, fileName, pattern, ch)
		channels[i] = ch
	}
	values := make([]*int, number)
	for {
		for i, value := range values {
			if value == nil {
				ch := channels[i]
				if number, ok := <-ch; ok {
					values[i] = &number
				}
			}
		}
		minIdx := findMin(values)
		if minIdx == -1 {
			break
		}
		select {
		case <-done:
			break
		case out <- *values[minIdx]:
		}
		values[minIdx] = nil
	}
	close(out)
	return
}
