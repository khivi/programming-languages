package com.khivi.merge

object MergeSorted {
  def apply[T <% Ordered[T]](streams: Seq[Stream[T]]): Stream[T] =  new MergeSorted(streams).toStream
}

class MergeSorted[T <% Ordered[T]](streams: Seq[Stream[T]]) {

      private type SI = (Stream[T], Int)

      private[this] def getStream(streams: Seq[SI]): Stream[T] = {

        def  getMin: Option[SI] = streams.foldRight(None: Option[SI]){ (stream, min)  =>
          if (stream._1.isEmpty)
            min
          else if (min.isEmpty || stream._1.head < min.get._1.head)
            Some(stream)
          else
            min
        }

        getMin  match {
          case None  => Stream.empty
          case Some(min) =>  val newStreams: Seq[SI] = streams.updated(min._2, (min._1.tail, min._2))
            //.map(_._1).filter(!_.isEmpty).zipWithIndex
                             min._1.head #:: getStream(newStreams)
        }
      }

    private def toStream: Stream[T] = getStream(streams.zipWithIndex)
}
