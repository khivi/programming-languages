
use std::fs::File;
use std::io::{self, BufRead};
use regex::Regex;

#[macro_use]
extern crate lazy_static;


struct State<T>(Box<dyn Iterator<Item = T>>, Option<T>);
pub struct Merge {
    count: usize,
    states: Vec<State<u32>>
}

impl Merge {
    pub fn new(filename: &str) -> Self { 
        let count = get_number(filename).unwrap();
        let mut states: Vec<State<u32>> = Vec::with_capacity(count);
        for i in 0..count {
            let collection = Box::new(get_collection(filename, i).unwrap());
            let state = State(collection, None);
            states.push(state);
        }
        Merge{count: count, states: states}
    }
}

impl Iterator for Merge  {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        let count = self.count;
        let states = &mut self.states;
        loop {
            for i in 0..count {
                let mut state = &mut states[i];
                if state.1.is_none() {
                    state.1 = state.0.next();
                }
            }
            let not_done = states.iter().any(|s| s.1.is_some());
            if !not_done {
                return None;
            }

            let mut min = u32::MAX;
            let mut min_index = usize::MIN;
            for i in 0..count {
                let state = &mut states[i];
                if let Some(val) = state.1 {
                    if val < min { 
                        min = val;
                        min_index = i;
                    }
                }
            }
            states[min_index].1 = None;
            return Some(min);
        }
    }
}

pub fn get_number(filename: &str) -> io::Result<usize> {
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

pub fn get_collection(filename: &str, idx: usize) -> io::Result<impl Iterator<Item = u32>> {
    let regex: Regex = { 
        let r = format!("COLLECTION{}:(.*)", idx);
        Regex::new(&r).unwrap()
    };
    get_numbers(filename, &regex)
}

fn get_numbers(filename: &str, regex: &Regex) -> io::Result<impl Iterator<Item = u32>> {
    let matches = match_lines(filename, regex)?;
    let to_int = |v: &str| -> Option<u32> { 
        if let Ok(i) = v.parse::<u32>() {
            Some(i)
        } else {
            None
        }
    };
    let values = matches.map(move |s| {
        let numbers = s.split(',').filter_map(|v| to_int(&v));
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

    fn merge(filename: &str) -> (impl Iterator<Item = u32>, impl Iterator<Item = u32>) {
        let result = Merge::new(filename);
        let output = get_output(filename).unwrap();
        (result, output)
    }

    fn assert_iterator(iter1: &mut impl Iterator<Item = u32>, iter2: &mut impl Iterator<Item = u32>) -> bool {
        loop {
            match (iter1.next(), iter2.next()) {
                (None, None) => return true,
                (Some(v1), Some(v2)) if v1 == v2 => continue,
                _ => return false
            }
        }
    }

    #[test]
    fn test_merge() {
        let filename = "../data/test.txt";
        let (mut result, mut output) = merge(filename);
        assert!(assert_iterator(&mut result, &mut output));
    }

    #[test]
    #[should_panic]
    fn test_bad_merge() {
        let filename = "../data/bad.txt";
        let (_result, _output) = merge(filename);
    }

    #[test]
    fn test_zero_merge() {
        let filename = "../data/zero.txt";
        let (mut result, mut output) = merge(filename);
        assert!(result.next().is_none());
        assert!(output.next().is_none());
    }

    #[test]
    fn test_err() {
        let filename = "../data/err.txt";
        let (mut result, mut output) = merge(filename);
        assert!(!assert_iterator(&mut result, &mut output));
    }
}
