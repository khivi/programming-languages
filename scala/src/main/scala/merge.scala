package com.khivi.merge

object MergeSorted {
  def apply[T <% Ordered[T]](collections: Seq[Iterable[T]]) =  new MergeSorted(collections)
}

class MergeSorted[T <% Ordered[T]](collections: Seq[Iterable[T]]) extends Iterable[T] {
    override def iterator: Iterator[T] = new MyIterator()

	private class MyIterator extends Iterator[T] {
        private case class IterInfo(private val iter: Iterator[T]) {
          def elem = curr
          private[this] var curr = next
          def nextElem { curr = next }

          private[this] def next: Option[T] = elem match {
            case None => None
            case _ if (iter.hasNext) => Some(iter.next)
            case _ => None
          }
        }

        private[this] val iters = collections.map{c => IterInfo(c.iterator) }

        override def hasNext: Boolean = iters.exists(_.elem.isDefined)
        override def next: T = {
          val minIter = iters.filter(_.elem.isDefined).minBy(_.elem.get)
          val min = minIter.elem
          minIter.nextElem
          min.get
        }
	}
}
