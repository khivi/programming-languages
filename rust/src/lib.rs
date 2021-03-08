use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;
use regex::Regex;

#[macro_use]
extern crate lazy_static;
pub fn get_number<P: AsRef<Path>>(filename: P) -> io::Result<u32> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"NUMBER=(\d+)").unwrap();
    }
    if let Ok(lines) = read_lines(filename) {
        for line in lines {
            if let Some(n) = RE.captures(&line) {
                return Ok(n.get(1).unwrap().as_str().parse().unwrap());
            }
        }
    }
    Ok(0)
}

/*
fn read_lines<P: AsRef<Path>>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>> {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
*/

fn read_lines<P: AsRef<Path>>(filename: P) -> io::Result<impl Iterator<Item = String>> {
    let file = File::open(filename)?;
    Ok(FileReader::new(file))
}

struct FileReader {
    lines: io::Lines<io::BufReader<File>>
}

impl FileReader {
    fn new(file: File) -> FileReader {
        FileReader{ lines: io::BufReader::new(file).lines() }
    }
}

impl Iterator for FileReader {
    type Item = String;
    fn next(&mut self) -> Option<Self::Item> {
        if let Some(line) = self.lines.next() {
            return Some(line.unwrap());
        }
        None
    }
}




#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap() , 3);
    }
}
