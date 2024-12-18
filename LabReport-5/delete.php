<?php include 'config.php'; ?>

<?php
if (isset($_GET['id'])) {
    $bookID = $_GET['id'];
    $sql = "DELETE FROM Books WHERE BookID = $bookID";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Book deleted successfully!'); window.location='read.php';</script>";
    } else {
        echo "<script>alert('Error: Unable to delete book.'); window.location='read.php';</script>";
    }
} else {
    echo "<script>alert('Invalid request.'); window.location='read.php';</script>";
}
?>
