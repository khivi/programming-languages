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
    let mut matches = match_lines(filename, &RE)?;
    return Ok(matches.next().unwrap().parse().unwrap());
}

fn match_lines<P: AsRef<Path>>(filename: P, regex: &'static Regex) -> io::Result<impl Iterator<Item = String>> {
    let lines = read_lines(filename)?;
    let matches = lines.filter_map(move |line| regex.captures(&line).map(|captures| captures[1].to_string()));
    Ok(matches)
}

fn read_lines<P: AsRef<Path>>(filename: P) -> io::Result<impl Iterator<Item = String>> {
    let file = File::open(filename)?;
    return Ok(io::BufReader::new(file).lines().map(|line| 
        line.unwrap()
    ));
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap() , 3);
    }
}
