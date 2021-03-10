
use std::fs::File;
use std::io::{self, BufRead};
use regex::Regex;

#[macro_use]
extern crate lazy_static;

pub fn get_number(filename: &str) -> io::Result<u32> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"NUMBER=(\d+)").unwrap();
    }
    let mut matches = match_lines(filename, &*RE)?;
    return Ok(matches.next().unwrap().parse().unwrap());
}


pub fn get_output(filename: &str) -> io::Result<impl Iterator<Item = u32>> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"OUTPUT:(.*)").unwrap();
    }
    get_numbers(filename, &*RE)
}

pub fn get_collection(filename: &str, idx: u32) -> io::Result<impl Iterator<Item = u32>> {
    let regex: Regex = { 
        let r = format!("COLLECTION{}:(.*)", idx);
        Regex::new(&r).unwrap()
    };
    get_numbers(filename, &regex)
}

pub fn get_numbers(filename: &str, regex: &Regex) -> io::Result<impl Iterator<Item = u32>> {
    let matches = match_lines(filename, regex)?;
    let values = matches.map(|s| {
        let numbers = s.split(',').map(|v| v.parse::<u32>().unwrap());
        numbers.collect::<Vec<_>>()
    }).flatten();
    Ok(values)
}


fn match_lines(filename: &str, regex: &Regex) -> io::Result<impl Iterator<Item = String>> {
    let read_lines = move || -> io::Result<_> {
        let file = File::open(filename)?;
        Ok(io::BufReader::new(file).lines().map(|line| 
            line.unwrap()))
    };
    let lines = read_lines()?;
    let r = regex.clone(); // TODO
    let matches = lines.filter_map(move |line| {
        r.captures(&line).map(|captures|
            captures[1].to_string()
        )
    });
    Ok(matches)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap() , 3);
    }

    #[test]
    fn test_output() {
        let output = [1,1,2,2,3,4,4,6,7,9,9,20,21];
        assert_eq!(get_output("../data/test.txt").unwrap().collect::<Vec<_>>(), output);
    }

    #[test]
    fn test_collection() {
        let output = [2, 4, 6, 9, 20];
        assert_eq!(get_collection("../data/test.txt", 1).unwrap().collect::<Vec<_>>(), output);
    }
}
