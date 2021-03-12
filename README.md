# Exploratation of Languages

  Solving same problem in multiple programming languages.

## Problem Statement
  Implement a class that takes a list of sorted collections and returns a sorted iterator.

```
class MergeSorted<E> {
    MergeSorted(List<Iterable<E>> collections);
    public Iterator<E> iterator();
}
```

* In each language use the language specific idioms.
* Try to use iterators  (lazy) specific to each language.

### Testing
* Read test file one time for each colection
* Assume data is too large to fit into memory at same time
* There are 2 files 
   * data/test.txt is successful test 
   * data/err.txt is a error test. The data is larger. **NOTE**: The full file should not be read to indicate the data is invalid. aka lazy)
* Each file has:
   * Header line of format NUMBER=\d+ for number of collections in file.
   * Note collections and results can span multiple lines.
   * Collection lines of form COLLECTION{num}=\d+,\d+,... where num is collection number
   * Collection numbers are from 0 to n-1
   * Result lines are of form OUTPUT=\d+,\d+,


[![Build Status](https://travis-ci.org/khivi/programming-languages.svg?branch=master)](https://travis-ci.org/khivi/programming-languages)
