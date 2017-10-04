package merge

import "bufio"
import "os"
import "regexp"
import "strconv"
import "strings"


func f1(v int) int {
    return v+1
}


func readFileWithPrefixMatch(fileName string, pattern string) (lines []string) {
    file, _ := os.Open(fileName)
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        var line = scanner.Text()
        if matched, _ := regexp.MatchString("^"+pattern, line); matched {
            line = strings.TrimPrefix(line, pattern)
            lines = append(lines, line)
        }
    }
    return
}

func readNumber(fileName string, pattern string) int {
    lines := readFileWithPrefixMatch(fileName, pattern)
    number, _ := strconv.Atoi(lines[0])
    return number
}

func readNumberList(fileName string, pattern string) (numbers []int) {
    for _, line := range readFileWithPrefixMatch(fileName, pattern) {
        for _, s := range strings.Split(line, ",") {
            number, _ := strconv.Atoi(s)
            numbers = append(numbers, number)
        }
    }
    return
}

