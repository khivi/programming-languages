package com.khivi.merge;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import java.lang.Iterable;
import java.lang.UnsupportedOperationException;
import java.util.NoSuchElementException;

public class MergeSorted<E extends Comparable<E>> implements Iterable<E> {

	@Override
	public Iterator<E> iterator() { return new MyIterator(); }

	public MergeSorted(List<Iterable<E>> collections) {
		m_collections = collections;
	}
	private final List<Iterable<E>> m_collections;


	class MyIterator implements Iterator<E> {
		MyIterator() {
			int size = m_collections.size();
			m_iters = new ArrayList<Iterator<E>>(size);
			m_elems = new ArrayList<E>(size);
			for (int i=0;i< size; i++) {
				Iterator<E> iter = m_collections.get(i).iterator(); // we get a new iterator each time
				m_iters.add(i, iter);
				m_elems.add(i, next(iter));
			}
		}

		private E next(Iterator<E> iter) {
			if (iter.hasNext())
				return iter.next();
			return null;
		}

		private final List<Iterator<E>> m_iters;
		private final List<E> m_elems;

		@Override
		public boolean hasNext() {
			for (E elem : m_elems) {
				if (elem != null)
					return true;
			}
			return false;
		}

		@Override
		public E next() {
			int i = minIdx();
			E min = m_elems.get(i);
			Iterator<E> iter = m_iters.get(i);
			m_elems.set(i, next(iter));
			return min;
		}

		private int minIdx() {
			int min = -1;
			for (int i=0;i< m_collections.size(); i++) {
				E elem = m_elems.get(i);
				if (elem != null && (min == -1 || elem.compareTo(m_elems.get(min)) < 0))
					min = i;
			}
			if (min != -1) 
				return min;
			throw new NoSuchElementException();
		}

		@Override
		public void remove() {
			throw new UnsupportedOperationException();
		}
	}

}
