package merge

import "testing"

func TestF1(t *testing.T) {
    if (f1(1) != 2)  {
        t.Error(`f1 failed`)
    }
}

func TestReadFile(t *testing.T) {
    lines := readFile("../../../data/test.txt", "^NUMBER")
    if (len(lines) != 1)  {
        t.Error(`len(lines) failed`)
    }
    if (lines[0] != "NUMBER=3") {
        t.Error(`lines[0] failed`)
    }
}

