package com.khivi.merge

object MergeSorted {
  def apply[T <% Ordered[T]](streams: IndexedSeq[Stream[T]]): Stream[T] =  new MergeSorted(streams).toStream
}

class MergeSorted[T <% Ordered[T]](streams: IndexedSeq[Stream[T]]) {
      private[this] type SI = (Stream[T], Int)

      private[this] def getStream(streams: IndexedSeq[SI]): Stream[T] = {
        if (streams.isEmpty)
          return Stream.empty
        val (stream, idx) = streams.minBy(_._1.head)  
        val newStreams = stream.tail.isEmpty match  {
            case false => streams.updated(idx, (stream.tail, idx))
            case true => streams.filter(_._2 != idx).map(_._1).zipWithIndex
         }
         stream.head #:: getStream(newStreams)
      }

    private def toStream: Stream[T] = getStream(streams.filter(!_.isEmpty).zipWithIndex)
}
