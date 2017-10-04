package merge

import "reflect"
import "testing"

const fileName = "../../../data/test.txt"

func TestReadFile(t *testing.T) {
	ch := make(chan string)
	go readFileWithPrefixMatch(fileName, "NUMBER=", ch)
	line := <-ch
	if line != "3" {
		t.Error(`lines[0] failed`)
	}
}

func TestFindMin(t *testing.T) {
	var numbers []*int
	numbers = append(numbers, nil)
	for _, n := range []int{10, 2, 4, 5, 6, 1, 11} {
		var number int = n
		numbers = append(numbers, &number)
	}
	numbers = append(numbers, nil)
	if findMin(numbers) != 6 {
		t.Error(`TestFindMin failed`)
	}

}

func TestReadNumber(t *testing.T) {
	number := readNumber(fileName, "NUMBER=")
	if number != 3 {
		t.Error(`TestReadNumber failed`)
	}
}

func TestGetNumber(t *testing.T) {
	number := getNumber(fileName)
	if number != 3 {
		t.Error(`TestGetNumber failed`)
	}
}

func TestReadNumberList(t *testing.T) {
	ch := make(chan int)
	go readNumberList(fileName, "OUTPUT:", ch)
	actual := chanToSlice(ch)
	expected := []int{1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21}
	if !reflect.DeepEqual(actual, expected) {
		t.Error(`TestReadNumberList failed`)
	}
}

func TestGetOutput(t *testing.T) {
	ch := make(chan int)
	go getOutput(fileName, ch)
	actual := chanToSlice(ch)
	expected := []int{1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21}
	if !reflect.DeepEqual(actual, expected) {
		t.Error(`TestGetOutput failed`)
	}
}

func chanToSlice(ch <-chan int) (numbers []int) {
	for number := range ch {
		numbers = append(numbers, number)
	}
	return
}

func compareChannels(ch1 <-chan int, ch2 <-chan int) bool {
	for {
		e1, ok1 := <-ch1
		e2, ok2 := <-ch2
		if !ok1 && !ok2 {
			return true
		}
		if e1 != e2 {
			return false
		}
	}
}

func TestMerge(t *testing.T) {
	actual := make(chan int)
	expected := make(chan int)
	go Merge(fileName, actual)
	go getOutput(fileName, expected)
	if !compareChannels(actual, expected) {
		t.Error(`TestMerge failed`)
	}
}

func TestBadMerge(t *testing.T) {
	actual := make(chan int)
	expected := make(chan int)
	go Merge("../../../data/err.txt", actual)
	go getOutput(fileName, expected)
	if compareChannels(actual, expected) {
		t.Error(`TestBadMerge failed`)
	}
}
