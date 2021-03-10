
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
    let mut matches = match_lines(filename, &*RE)?;
    return Ok(matches.next().unwrap().parse().unwrap());
}



pub fn get_output<'a, P:'a + AsRef<Path>>(filename: P) -> io::Result<impl Iterator<Item = i32> + 'a> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"OUTPUT:(.*)").unwrap();
    }
    let matches = match_lines(filename, &*RE)?;
    let values = matches.map(|s| 
        s.split(',').map(|v| v.parse().unwrap()).collect::<Vec<_>>().into_iter()
    ).flatten();
    Ok(values)
}


fn match_lines<'a, P: 'a + AsRef<Path>>(filename: P, regex: &'a Regex) -> io::Result<impl Iterator<Item = String> + 'a> {
    let lines = read_lines(filename)?;
    let matches = lines.filter_map(move |line| {
        regex.captures(&line).map(|captures|
            captures[1].to_string()
        )
    });
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
    fn test_number() {
        assert_eq!(get_number("../data/test.txt").unwrap() , 3);
    }

    #[test]
    fn test_output() {
        let output = [1,1,2,2,3,4,4,6,7,9,9,20,21];
        assert_eq!(get_output("../data/test.txt").unwrap().collect::<Vec<_>>(), output);
    }
}
