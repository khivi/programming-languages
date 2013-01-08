import com.khivi.merge.MergeSorted


import org.scalatest.FunSuite

class TestSuite extends FunSuite {
  test("Unit test") {
    val collections = List(List("a", "d"),
                      List("a", "e", "g"),
                      List("d", "g", "z"))
    assert(MergeSorted(collections).iterator.toList === List("a", "a", "d", "d", "e", "g", "g", "z"))
  }
}
