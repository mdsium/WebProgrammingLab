<?php include 'config.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Book</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
</head>
<body class="p-4">
    <div class="container" style="width: 500px;">
        <h2>Update Book</h2>
        <?php
        if (isset($_GET['id'])) {
            $bookID = $_GET['id'];
            $sql = "SELECT * FROM Books WHERE BookID = $bookID";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
        ?>
                <form action="" method="POST">
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" name="title" id="title" class="form-control" value="<?php echo $row['Title']; ?>" required>
                    </div>
                    <div class="mb-3">
                        <label for="author" class="form-label">Author</label>
                        <input type="text" name="author" id="author" class="form-control" value="<?php echo $row['Author']; ?>" required>
                    </div>
                    <div class="mb-3">
                        <label for="genre" class="form-label">Genre</label>
                        <input type="text" name="genre" id="genre" class="form-control" value="<?php echo $row['Genre']; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Price</label>
                        <input type="number" name="price" id="price" class="form-control" step="0.01" value="<?php echo $row['Price']; ?>" required>
                    </div>
                    <div class="mb-3">
                        <label for="stock" class="form-label">Stock</label>
                        <input type="number" name="stock" id="stock" class="form-control" value="<?php echo $row['Stock']; ?>" required>
                    </div>
                    <button type="submit" name="update" class="btn btn-primary">Update Book</button>
                    <a href="view.php" class="btn btn-danger">Cancel</a>
                </form>
        <?php
            } else {
                echo "<div class='alert alert-danger'>Book not found.</div>";
            }
        }

        if (isset($_POST['update'])) {
            $title = $_POST['title'];
            $author = $_POST['author'];
            $genre = $_POST['genre'];
            $price = $_POST['price'];
            $stock = $_POST['stock'];

            $sql = "UPDATE Books SET Title='$title', Author='$author', Genre='$genre', Price='$price', Stock='$stock' WHERE BookID=$bookID";
            if ($conn->query($sql) === TRUE) {
                echo "<div class='alert alert-success mt-3'>Book updated successfully.</div>";
            } else {
                echo "<div class='alert alert-danger mt-3'>Error: " . $conn->error . "</div>";
            }
        }
        ?>
    </div>
</body>
</html>
