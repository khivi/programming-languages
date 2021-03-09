use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;
use regex::Regex;

//#[macro_use]
//extern crate lazy_static;
pub fn get_number<P: AsRef<Path>>(filename: P) -> io::Result<u32> {
    /*
    lazy_static! {
        static ref RE: Regex = Regex::new(r"NUMBER=(\d+)").unwrap();
    }
    */
    //let RE: Regex = Regex::new(r"NUMBER=(\d+)").unwrap();
    let regex: Regex = Regex::new(r"OUTPUT:(.*)").unwrap();
    let mut matches = match_lines(filename, &regex)?;
    return Ok(matches.next().unwrap().parse().unwrap());
}



pub fn get_output<P: AsRef<Path>>(filename: P) -> io::Result<impl Iterator<Item = i32>> {
    let regex: Regex = Regex::new(r"OUTPUT:(.*)").unwrap();
    let matches = match_lines(filename, &regex)?;
    let values = matches.map(|s| 
        s.split(',').map(|v| v.parse().unwrap()).collect::<Vec<_>>().into_iter()
    ).flatten();
    Ok(values)
}

fn captured(regex: &Regex, index: usize, line: &str) -> String {
    regex.captures(&line).unwrap()[index].to_string()
}

fn match_lines<P: AsRef<Path>>(filename: P, _regex: &Regex) -> io::Result<impl Iterator<Item = String>> {
    let lines = read_lines(filename)?;
    let matches = lines.filter_map(|line| 
        //Some(captured(regex, &line))
        Some(captured(&Regex::new(r"NUMBER=(.*)").unwrap(), 1, &line))
    );
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
    fn test_captured() {
        let regex: Regex = Regex::new(r"OUTPUT:(\d+),(.*)").unwrap();
        assert_eq!(captured(&regex, 1, "OUTPUT:1231,"), "1231");
        assert_eq!(captured(&regex, 2, "OUTPUT:3234,rust"), "rust");
    }

    #[test]
    fn get_test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap() , 3);
    }
}
