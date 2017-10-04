package merge

import "bufio"
import "os"
import "regexp"
import "strconv"
import "strings"


func f1(v int) int {
    return v+1
}


func readFileWithPrefixMatch(fileName string, pattern string, out chan <- string) {
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
    line := <- ch
    number, _ := strconv.Atoi(line)
    return number
}

func readNumberList(fileName string, pattern string, out chan <- int) {
    ch := make(chan string)
    go readFileWithPrefixMatch(fileName, pattern, ch)
    for line:= range ch {
        for _, s := range strings.Split(line, ",") {
            number, _ := strconv.Atoi(s)
            out <- number
        }
    }
    close(out)
    return
}

