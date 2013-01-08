import com.khivi.merge.MergeSorted


import org.scalatest.FunSuite

class TestSuite extends FunSuite {
  test("Unit test") {
    val collections = Seq(Seq("a", "d"),
                      Seq("a", "e", "g"),
                      Seq("d", "g", "z"))
    assert(MergeSorted(collections).iterator.toSeq === Seq("a", "a", "d", "d", "e", "g", "g", "z"))
  }

  test("File test" ) {
    import scala.io.Source
    val filename = "../data/test.txt"
    class TestFileReader(linePrefix: String) {
      import scala.util.matching.Regex
      private val regex = new Regex(linePrefix + ":(.*)")
      val elems = Source.fromFile(filename).getLines.toSeq.flatMap{line => 
        regex.findPrefixOf(line) match {
          case Some(regex(x)) => x.split(",").map(_.toInt)
          case None => Seq()
        }
      }
    }

    val number = Source.fromFile(filename).getLines.next.replaceAll("NUMBER=","").toInt
    val collections = (0 until number).map{n =>
                          new TestFileReader("COLLECTION"+n).elems
                      }
    val needResult = new TestFileReader("OUTPUT").elems
    assert(MergeSorted(collections).iterator.toSeq === needResult)
  }
}
