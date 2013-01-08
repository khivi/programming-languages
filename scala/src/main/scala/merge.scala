package com.khivi.merge

object MergeSorted {
  def apply[T <% Ordered[T]](collections: Seq[Iterable[T]]) =  new MergeSorted(collections)
}

class MergeSorted[T <% Ordered[T]](collections: Seq[Iterable[T]]) extends Iterable[T] {
    override def iterator: Iterator[T] = new MyIterator()

	class MyIterator extends Iterator[T] {
        private case class IterInfo(private val iter: Iterator[T]) {
          var elem = next
          def iterNext { elem = next }

          private def next: Option[T] = elem match {
            case None => None
            case _ if (iter.hasNext) => Some(iter.next)
            case _ => None
          }
        }

        private val iters = collections.map{c => IterInfo(c.iterator) }

        override def hasNext: Boolean = iters.exists(_.elem.isDefined)
        override def next: T = {
          val minIter = iters.filter(_.elem.isDefined).minBy(_.elem.get)
          val min = minIter.elem
          minIter.iterNext
          min.get
        }
	}
}
