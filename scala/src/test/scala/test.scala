import com.khivi.merge.MergeSorted

import com.khivi.lazysplit.StreamSplit._
import scala.io.Source
import org.scalatest.FunSuite
import scala.util.matching.Regex

class TestSuite extends FunSuite {
  test("Simple test") {
    val collections = IndexedSeq(
                        Seq("a", "d"),
                        Seq("a", "e", "g"),
                        Seq("d", "g", "z")
                      ).map(_.toStream)
    val output = collections.flatMap(x=>x).sorted
    assert(MergeSorted(collections) === output)
  }

  test("Infinite streams first" ) {
    // Input is from n...infinity
    // Output is -1,-1,-1...
    val collections = (0 until 1000).foldLeft(List[Stream[Int]]())((r, i) => Stream.from(i) :: r).toIndexedSeq
    val output = Stream.from(-1,0)
    assert(MergeSorted(collections) != output)
  }

  test("Infinite streams second" ) {
    // Input is from 1...infinity
    // Output is 1,1,1,...
    val collections = (0 until 1000).foldLeft(List[Stream[Int]]())((r, _) => Stream.from(1) :: r).toIndexedSeq
    val output = Stream.from(1,0)
    assert(MergeSorted(collections) != output)
  }

  test("File test" ) {
    val testFile = TestFile("../data/test.txt")
    assert(MergeSorted(testFile.collections) === testFile.output)
  }

  test("File error" ) {
    val testFile = TestFile("../data/err.txt")
    assert(testFile.output.size === 3)
    assert(testFile.output.head === 10)
    assert(testFile.output.last === 3000)
    val gotResult = MergeSorted(testFile.collections)
    assert(gotResult.head === 1)
    assert(gotResult != testFile.output)
  }

}

class TestFile(filename: String) {
    //private val number = Source.fromFile(filename).getLines.next.replaceAll("NUMBER=","").toInt
    private val header = Source.fromFile(filename).getLines.next
    private val number = """NUMBER=(\d+)""".r.findFirstMatchIn(header).get.group(1).toInt
    val collections = (0 until number).map(n=>FileMatchIterator(filename, "COLLECTION"+n))
    val output = FileMatchIterator(filename, "OUTPUT")
}

object TestFile {
  def apply(filename: String) = new TestFile(filename)
}


class FileMatchIterator(filename: String, linePrefix: String) {
  private val prefix = linePrefix + ":"
  private[this] def getStream(lines: Stream[String], data: Stream[Int] = Stream.empty): Stream[Int] = {
    data.isEmpty match {
      case true => lines.isEmpty match {
                      case false => val line = lines.head
                                    line.startsWith(prefix) match {
                                      case true => val data = line.stripPrefix(prefix).
                                                                   splitAsStream(',').
                                                                   map(_.toInt)
                                                   getStream(lines.tail, data)
                                      case false =>  getStream(lines.tail, Stream.empty)
                                    }
                      case true => Stream.empty
                    }
      case false => data.head #:: getStream(lines, data.tail)
    }
  }
  private def toStream: Stream[Int] = getStream(Source.fromFile(filename).getLines.toStream)
}

object FileMatchIterator {
  def apply(filename: String, linePrefix: String): Stream[Int] = new FileMatchIterator(filename, linePrefix).toStream
}
