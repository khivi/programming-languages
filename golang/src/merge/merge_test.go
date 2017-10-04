package merge

import "testing"

func TestF1(t *testing.T) {
    if (f1(1) != 2)  {
        t.Error(`f1 failed`)
    }
}

