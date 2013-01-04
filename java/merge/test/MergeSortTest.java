package com.khivi.merge.test;


import com.khivi.merge.MergeSort;

import java.lang.Iterable;
import java.util.ArrayList;
import java.util.List;

public class MergeSortTest {
	public static void main(String[] args){
		List<Iterable<String>> collections = new ArrayList<Iterable<String>>();
		collections.add(Util.asList("a", "d"));
		collections.add(Util.asList("a", "e", "g"));
		collections.add(Util.asList("d", "g", "z"));

		MergeSort<String> ms = new MergeSort<String>(collections);
		List<String> result = Util.asList(ms.iterator());

		//  check
		List<String> needResult = Util.asList( "a", "a", "d", "d", "e", "g", "g", "z" );
		assert(needResult.equals(result));
	}
}

