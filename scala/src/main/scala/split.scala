package com.khivi.lazysplit

import scala.util.matching.Regex

class StreamSplit(str: String) {
  def splitAsStream(separator: Char): Stream[String] =  splitAsStream(Util.toRegex(separator))
  def splitAsStream(separators: Array[Char]): Stream[String] = splitAsStream(Util.toRegex(separators))

  private[this] def splitAsStream(regex: Regex): Stream[String] = {

    def split(curr: String): Stream[String] = {
        regex.findFirstMatchIn(curr) match {
          case None => if (curr.isEmpty) Stream.empty else Stream(curr)
          case Some(m) => curr.take(m.start) #:: split(curr.drop(m.end))
        }
    }

    split(str)
  }
}

object StreamSplit {
  implicit def stringToStreamSplit (str: String) = new StreamSplit(str)
}

private object Util {
  def toRegex(ch: Char): Regex = ("\\Q" + ch + "\\E").r
  def toRegex(chs: Array[Char]): Regex = (chs.foldLeft("[")(_+toRegex(_)) + "]").r
}
