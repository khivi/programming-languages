import com.khivi.merge.MergeSorted

import scala.io.Source
import org.scalatest.FunSuite
import scala.util.matching.Regex

class TestSuite extends FunSuite {
  test("Unit test") {
    val collections = Seq(Seq("a", "d"),
                      Seq("a", "e", "g"),
                      Seq("d", "g", "z")).map(_.toStream)
    assert(MergeSorted(collections) === Stream("a", "a", "d", "d", "e", "g", "g", "z"))
  }

  test("File test" ) {
    val filename = "../data/test.txt"
    val number = Source.fromFile(filename).getLines.next.replaceAll("NUMBER=","").toInt
    val collections = (0 until number).map(n=>FileIterator(filename, "COLLECTION"+n))
    val needResult = FileIterator(filename, "OUTPUT")
    assert(MergeSorted(collections) === needResult)
  }
}

class FileIterator(filename: String, linePrefix: String) {
  private[this] val regex = new Regex(linePrefix + ":(.*)")
  private[this] def getStream(lines: Stream[String], data: Stream[Int]): Stream[Int] = {
    data.isEmpty match {
      case true => lines.isEmpty match {
                      case false =>  regex.findPrefixOf(lines.head) match {
                                            case Some(regex(x)) => val data = x.split(",").map(_.toInt).toStream 
                                                                   getStream(lines.tail, data)
                                            case None => getStream(lines.tail, Stream.empty)
                                          }
                      case true => Stream.empty
                    }
      case false => data.head #:: getStream(lines, data.tail)
    }
  }
  private def toStream: Stream[Int] = getStream(Source.fromFile(filename).getLines.toStream, Stream.empty)
}

object FileIterator {
  def apply(filename: String, linePrefix: String): Stream[Int] = new FileIterator(filename, linePrefix).toStream
}
