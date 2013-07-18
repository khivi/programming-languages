import com.khivi.merge.MergeSorted


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
    import scala.io.Source
    val filename = "../data/test.txt"

    class FileIterator(linePrefix: String) {
      private[this] val regex = new Regex(linePrefix + ":(.*)")
      private[this] def getStream(lines: Stream[String], data: Stream[Int]): Stream[Int] = {
        data.isEmpty match {
          case true => lines.headOption match {
                          case Some(line) =>  regex.findPrefixOf(line) match {
                                                case Some(regex(x)) => val data = x.split(",").map(_.toInt).toStream 
                                                                        data.isEmpty match {
                                                                          case true => getStream(lines.tail, Stream.empty)
                                                                          case false => data.head #:: getStream(lines.tail, data.tail)
                                                                        }
                                                case None => getStream(lines.tail, Stream.empty)
                                              }
                          case None => Stream.empty
                        }
          case false => data.head #:: getStream(lines, data.tail)
        }
      }
      def toStream: Stream[Int] = getStream(Source.fromFile(filename).getLines.toStream, Stream.empty)
    }

    object FileIterator {
      def apply(linePrefix: String): Stream[Int] = new FileIterator(linePrefix).toStream
    }

    val number = Source.fromFile(filename).getLines.next.replaceAll("NUMBER=","").toInt
    val collections = (0 until number).map(n=>FileIterator("COLLECTION"+n))
    val needResult = FileIterator("OUTPUT")
    assert(MergeSorted(collections) === needResult)
  }
}
