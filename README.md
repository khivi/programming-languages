
# Exploratation of Programming Languages

  Solving same problem in multiple programming languages.

## Problem Statement
  Implement a class that takes a list of sorted collections and returns a lazy sorted list.

  class MergeSorted<E> {
	 MergeSorted(List<Iterable<E>> collections);
	 public Iterator<E> iterator();
  }

* In each language use the language specific idioms.
* Try to use lazy patterns specific to language

### Testing
* Read file one time for each colection
* Assume data is too large to fit into memory at same time
* There are 2 files data.txt is successful test and err.txt is a error test
* Each file has:
	* Header line of format NUMBER=\d+. Number of collections
	* Note collections and results are multiline. Concatenate all the lines.
	* Collection lines of form COLLECTION<num>=\d+,\d+,...
	* Collection number are from 0 to n-1
	* Result lines of form OUTPUT=\d+,\d+,
