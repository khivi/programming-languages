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
    lines := readFileWithPrefixMatch(fileName, "NUMBER=")
    if (len(lines) != 1)  {
        t.Error(`len(lines) failed`)
    }
    if (lines[0] != "3") {
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
    numbers := readNumberList(fileName, "OUTPUT:")
    expected := []int {1,1,2,2,3,4,4,6,7,9,9,20,21}
    if (!reflect.DeepEqual(numbers, expected)) {
        t.Error(`TestReadNumberList failed`)
    }
}

