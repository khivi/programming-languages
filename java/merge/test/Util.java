package com.khivi.merge.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

public class Util {

	@SafeVarargs
	static <T> List<T> asList(T...array) {
		List<T> l = new ArrayList<T>();
		for (T t: array)
			l.add(t);
		return l;
	}

	static <T> List<T> asList(Iterator<T> iter) {
		List<T> l = new ArrayList<T>();
		while (iter.hasNext())
			l.add(iter.next());
		return l;
	}

}

