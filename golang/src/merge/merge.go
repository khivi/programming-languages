package merge

import "bufio"
import "fmt"
import "os"
import "regexp"
import "strconv"
import "strings"

func readFileWithPrefixMatch(fileName string, pattern string, out chan<- string) {
	file, _ := os.Open(fileName)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		var line = scanner.Text()
		if matched, _ := regexp.MatchString("^"+pattern, line); matched {
			line = strings.TrimPrefix(line, pattern)
			out <- line
		}
	}
	close(out)
	return
}

func readNumber(fileName string, pattern string) int {
	ch := make(chan string)
	go readFileWithPrefixMatch(fileName, pattern, ch)
	line := <-ch
	number, _ := strconv.Atoi(line)
	return number
}

func readNumberList(fileName string, pattern string, out chan<- int) {
	ch := make(chan string)
	go readFileWithPrefixMatch(fileName, pattern, ch)
	for line := range ch {
		ch1 := make(chan string)
		go lazySplit(line, ",", ch1)
		for s := range ch1 {
			number, _ := strconv.Atoi(s)
			out <- number
		}

	}
	close(out)
	return
}

func getNumber(fileName string) int {
	return readNumber(fileName, "NUMBER=")
}

func getOutput(fileName string, out chan<- int) {
	readNumberList(fileName, "OUTPUT:", out)
	return
}

func lazySplit(s, sep string, out chan<- string) {
	for {
		idx := strings.Index(s, sep)
		if idx == -1 {
			out <- s
			close(out)
			return
		}
		out <- s[0:idx]
		s = s[idx+1:]
	}
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

func Merge(fileName string, out chan<- int) {
	number := getNumber(fileName)
	channels := make([]chan int, number)
	for i := 0; i < number; i++ {
		pattern := fmt.Sprintf("COLLECTION%d:", i)
		ch := make(chan int)
		go readNumberList(fileName, pattern, ch)
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
		out <- *values[minIdx]
		values[minIdx] = nil
	}
	close(out)
	return
}
