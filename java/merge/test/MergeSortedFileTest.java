package com.khivi.merge.test;


import com.khivi.merge.MergeSorted;

import java.lang.Iterable;
import java.util.ArrayList;
import java.util.List;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.Reader;

import java.io.IOException;
import java.io.FileNotFoundException;

import java.nio.ByteBuffer;

import java.util.regex.Pattern;
import java.util.regex.Matcher;


public class MergeSortedFileTest {

	private static class TestFileReader {
		TestFileReader(String filename, String linePrefix) throws FileNotFoundException, IOException {
			Pattern pattern = Pattern.compile(linePrefix+":(.*)");
			BufferedReader r = new BufferedReader(new FileReader(filename));
			String line;
			while ((line = r.readLine()) != null) {
				Matcher matcher = pattern.matcher(line);
				if (matcher.matches()) {
					for (String str:  matcher.group(1).split(",")) {
						elems.add(Integer.parseInt(str));
					}
				}
			}
		}

		private final List<Integer> elems = new ArrayList<Integer>();
	}

	public static void main(String[] args) throws Exception {

		//String filename = "/home/khivi/Personal/programming/prog-lang-explore/data/test.txt";
		String filename = args[0];

		int numCollections = Integer.parseInt(new BufferedReader(new FileReader(filename)).readLine().replaceAll("NUMBER=",""));

		List<Iterable<Integer>> collections = new ArrayList<Iterable<Integer>>();
		for (int n=0; n<numCollections; n++) {
			String prefix = "COLLECTION" + n;
			TestFileReader reader = new TestFileReader(filename, prefix);
			collections.add(reader.elems);
		}

		List<Integer> needResult = new TestFileReader(filename, "OUTPUT").elems;

		MergeSorted<Integer> ms = new MergeSorted<Integer>(collections);
		List<Integer> result = Util.asList(ms.iterator());
		assert(needResult.equals(result));
		System.out.println("Checked file " + filename);
	}
}

