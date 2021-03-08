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
            if let Some(n) = RE.captures(&line.unwrap()) {
                return Ok(n.get(1).unwrap().as_str().parse().unwrap());
            }
        }
    }
    Ok(0)
}

fn read_lines<P: AsRef<Path>>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>> {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap() , 3);
    }
}
