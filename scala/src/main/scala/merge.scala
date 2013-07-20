package com.khivi.merge

object MergeSorted {
  def apply[T <% Ordered[T]](streams: Seq[Stream[T]]): Stream[T] =  new MergeSorted(streams).toStream
}

class MergeSorted[T <% Ordered[T]](streams: Seq[Stream[T]]) {
      private[this] type SI = (Stream[T], Int)

      private[this] def getStream(streams: Seq[SI]): Stream[T] = {
        def getMin: Option[SI] = streams.foldRight(None: Option[SI]){ (stream, min) =>
          if (stream._1.isEmpty)
            min
          else if (min.isEmpty || stream._1.head < min.get._1.head)
            Some(stream)
          else
            min
        }

        getMin match {
          case None => Stream.empty
          case Some(min) => val stream = min._1
                            val idx = min._2
                            val newStreams = stream.tail.isEmpty match  {
                                case false => streams.updated(idx, (stream.tail, idx))
                                case true => streams.filter(_._2 != idx).map(_._1).zipWithIndex
                             }
                             stream.head #:: getStream(newStreams)
        }
      }

    private def toStream: Stream[T] = getStream(streams.filter(!_.isEmpty).zipWithIndex)
}
