package merge

import "testing"
import "reflect"

func TestF1(t *testing.T) {
    if (f1(1) != 2)  {
        t.Error(`f1 failed`)
    }
}

var fileName = "../../../data/test.txt"

func TestReadFile(t *testing.T) {
    ch := make(chan string)
    go readFileWithPrefixMatch(fileName, "NUMBER=", ch)
    line := <- ch
    if (line != "3") {
        t.Error(`lines[0] failed`)
    }
}

func TestReadNumber(t *testing.T) {
    number := readNumber(fileName, "NUMBER=")
    if (number != 3) {
        t.Error(`TestReadNumber failed`)
    }
}

func TestReadNumberList(t *testing.T) {
    ch := make(chan int)
    go readNumberList(fileName, "OUTPUT:", ch)
    var numbers []int
    for number :=  range ch {
        numbers = append(numbers, number)
    }
    expected := []int {1,1,2,2,3,4,4,6,7,9,9,20,21}
    if (!reflect.DeepEqual(numbers, expected)) {
        t.Error(`TestReadNumberList failed`)
    }
}

