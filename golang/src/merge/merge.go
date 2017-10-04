package merge

import "bufio"
import "os"
import "regexp"


func f1(v int) int {
    return v+1
}


func readFile(fileName string, pattern string) (lines []string) {
    file, _ := os.Open(fileName)
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        var line = scanner.Text()
        if matched, _ := regexp.MatchString(pattern, line); matched {
            lines = append(lines, line)
        }
    }
    return
}

