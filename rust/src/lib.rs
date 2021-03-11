use regex::Regex;
use std::fs::File;
use std::io::{self, BufRead};
use std::str::FromStr;

#[macro_use]
extern crate lazy_static;
extern crate if_chain;

struct State<'a, T>(Box<dyn 'a + Iterator<Item = T>>, Option<T>);

pub struct Merge<'a, T> {
    count: usize,
    states: Vec<State<'a, T>>,
}

impl<'a, T: 'a + FromStr> Merge<'a, T> {
    pub fn new(filename: &str) -> Self {
        let count = get_number(filename).unwrap();
        let states = (0..count).map(|i| {
            let collection = Box::new(get_collection(filename, i).unwrap());
            State(collection, None)
        }).collect();
        Merge {
            count: count,
            states: states,
        }
    }
}

impl<'a, T: PartialOrd> Iterator for Merge<'a, T> {
    type Item = T;
    fn next(&mut self) -> Option<Self::Item> {
        let count = self.count;
        let states = &mut self.states;
        for i in 0..count {
            let state = &mut states[i];
            if state.1.is_none() {
                state.1 = state.0.next();
            }
        }
        let mut min_index: Option<usize> = None;
        for i in 0..count {
            if_chain::if_chain! {
                if let Some(_) = states[i].1.as_ref();
                if min_index.is_none();
                then {
                    min_index.replace(i);
                }
            }
            if_chain::if_chain! {
                if let Some(val) = states[i].1.as_ref();
                if let Some(m) = min_index;
                if let Some(min) = states[m].1.as_ref();
                if val < min;
                then {
                    min_index.replace(i);
                }
            }
        }
        if let Some(m) = min_index { 
            return states[m].1.take();
        }
        return None;
    }
}

pub fn get_number(filename: &str) -> io::Result<usize> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"NUMBER=(\d+)").unwrap();
    }
    let mut matches = match_lines(filename, &*RE)?;
    return Ok(matches.next().unwrap().parse().unwrap());
}

pub fn get_output<T: FromStr>(filename: &str) -> io::Result<impl Iterator<Item = T>> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"OUTPUT:(.*)").unwrap();
    }
    get_numbers(filename, &*RE)
}

pub fn get_collection<T: FromStr>(filename: &str, idx: usize) -> io::Result<impl Iterator<Item = T>> {
    let regex: Regex = {
        let r = format!("COLLECTION{}:(.*)", idx);
        Regex::new(&r).unwrap()
    };
    get_numbers(filename, &regex)
}

fn get_numbers<T: FromStr>(filename: &str, regex: &Regex) -> io::Result<impl Iterator<Item = T>> {
    let matches = match_lines(filename, regex)?;
    let to_int = |v: &str| -> Option<T> {
        if let Ok(i) = v.parse::<T>() {
            Some(i)
        } else {
            None
        }
    };
    let values = matches
        .map(move |s| {
            let numbers = s.split(',').filter_map(|v| to_int(&v));
            numbers.collect::<Vec<_>>()
        })
        .flatten();
    Ok(values)
}

fn match_lines(filename: &str, regex: &Regex) -> io::Result<impl Iterator<Item = String>> {
    let read_lines = move || -> io::Result<_> {
        let file = File::open(filename)?;
        Ok(io::BufReader::new(file).lines().map(|line| line.unwrap()))
    };
    let lines = read_lines()?;
    let r = regex.clone(); // TODO
    let matches =
        lines.filter_map(move |line| r.captures(&line).map(|captures| captures[1].to_string()));
    Ok(matches)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap(), 3);
    }

    #[test]
    fn test_output() {
        let output = [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21];
        assert_eq!(
            get_output("../data/test.txt").unwrap().collect::<Vec<u32>>(),
            output
        );
    }

    #[test]
    fn test_collection() {
        let output = [2, 4, 6, 9, 20];
        assert_eq!(
            get_collection("../data/test.txt", 1)
                .unwrap()
                .collect::<Vec<u32>>(),
            output
        );
    }

    fn merge<'a, T: 'a + FromStr + PartialOrd>(filename: &str) -> (impl 'a + Iterator<Item = T>, impl Iterator<Item = T>) {
        let result = Merge::new(filename);
        let output = get_output(filename).unwrap();
        (result, output)
    }

    fn assert_iterator<T: PartialEq>(
        iter1: &mut impl Iterator<Item = T>,
        iter2: &mut impl Iterator<Item = T>,
    ) -> bool {
        loop {
            match (iter1.next(), iter2.next()) {
                (None, None) => return true,
                (Some(v1), Some(v2)) if v1 == v2 => continue,
                _ => return false,
            }
        }
    }

    #[test]
    fn test_merge() {
        let filename = "../data/test.txt";
        let (mut result, mut output) = merge::<u32>(filename);
        assert!(assert_iterator(&mut result, &mut output));
    }

    #[test]
    #[should_panic]
    fn test_bad_merge() {
        let filename = "../data/bad.txt";
        let (_result, _output) = merge::<u32>(filename);
    }

    #[test]
    fn test_zero_merge() {
        let filename = "../data/zero.txt";
        let (mut result, mut output) = merge::<u32>(filename);
        assert!(result.next().is_none());
        assert!(output.next().is_none());
    }

    #[test]
    fn test_err() {
        let filename = "../data/err.txt";
        let (mut result, mut output) = merge::<u32>(filename);
        assert!(!assert_iterator(&mut result, &mut output));
    }
}
