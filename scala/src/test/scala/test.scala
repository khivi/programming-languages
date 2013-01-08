import com.khivi.merge.MergeSorted


import org.scalatest.FunSuite

class TestSuite extends FunSuite {
  test("Unit test") {
    val collections = Seq(Seq("a", "d"),
                      Seq("a", "e", "g"),
                      Seq("d", "g", "z"))
    assert(MergeSorted(collections).toSeq === Seq("a", "a", "d", "d", "e", "g", "g", "z"))
  }

  test("File test" ) {
    import scala.io.Source
    val filename = "../data/test.txt"

    class FileIterator(linePrefix: String) extends Iterable[Int] {
      import scala.util.matching.Regex
      private[this] val regex = new Regex(linePrefix + ":(.*)")
      private[this] val elems = Source.fromFile(filename).getLines.flatMap{line => 
        regex.findPrefixOf(line) match {
          case Some(regex(x)) => x.split(",").map(_.toInt)
          case None => Seq()
        }
      }
      override def iterator = elems
    }

    val number = Source.fromFile(filename).getLines.next.replaceAll("NUMBER=","").toInt
    val collections = (0 until number).map{n =>
                          new FileIterator("COLLECTION"+n)
                      }
    val needResult = new FileIterator("OUTPUT")
    assert(MergeSorted(collections).toSeq === needResult.toSeq)
  }
}
