package merge

import "bufio"
import "fmt"
import "os"
import "regexp"
import "strconv"
import "strings"

func readFileWithPrefixMatch(done <-chan struct{}, fileName string, pattern string, out chan<- string) {
	defer close(out)
	file, _ := os.Open(fileName)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		var line = scanner.Text()
		if matched, _ := regexp.MatchString("^"+pattern, line); matched {
			line = strings.TrimPrefix(line, pattern)
			select {
			case <-done:
				return
			case out <- line:
			}
		}
	}
}

func readNumber(done <-chan struct{}, fileName string, pattern string) int {
	ch := make(chan string)
	go readFileWithPrefixMatch(done, fileName, pattern, ch)
	line := <-ch
	number, _ := strconv.Atoi(line)
	return number
}

func readNumberList(done <-chan struct{}, fileName string, pattern string, out chan<- int) {
	defer close(out)
	ch := make(chan string)
	go readFileWithPrefixMatch(done, fileName, pattern, ch)
	for line := range ch {
		ch1 := make(chan string)
		go lazySplit(done, line, ",", ch1)
		for s := range ch1 {
			number, _ := strconv.Atoi(s)
			out <- number
			fmt.Printf("%d\n", number) //debug only
		}
	}
}

func getNumber(fileName string) int {
	return readNumber(nil, fileName, "NUMBER=")
}

func getOutput(done <-chan struct{}, fileName string, out chan<- int) {
	readNumberList(done, fileName, "OUTPUT:", out)
}

func lazySplit(done <-chan struct{}, s, sep string, out chan<- string) {
	defer close(out)
	for {
		select {
		case <-done:
			return
		default:
			idx := strings.Index(s, sep)
			if idx == -1 {
				out <- s
				return
			}
			out <- s[0:idx]
			s = s[idx+1:]
		}
	}
}

func findMin(values []Value) (min *Value) {
	for idx, _ := range values {
		value := &values[idx]
		if value.valid {
			if min == nil || min.value > value.value {
				min = value
			}
		}
	}
	return
}

type Value struct {
	value int
	valid bool
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

	defer close(out)
	values := make([]Value, number)
	for {
		for i, _ := range values {
			value := &values[i]
			if !value.valid {
				if number, ok := <-channels[i]; ok {
					value.value = number
					value.valid = true
				}
			}
		}
		min := findMin(values)
		if min == nil {
			return
		}
		out <- min.value
		min.valid = false
	}
}
