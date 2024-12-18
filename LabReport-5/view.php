<?php include 'config.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Books List</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
</head>
<body class="p-4">
    <div class="container">
        <h2>Books List</h2>
        <a href="create.php" class="btn btn-success mb-3">Add New Book</a>
        
        <a href="index.php" class="btn btn-primary mb-3">HOME</a>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>BookID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th style="width: 150px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $sql = "SELECT * FROM Books";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>
                            <td>{$row['BookID']}</td>
                            <td>{$row['Title']}</td>
                            <td>{$row['Author']}</td>
                            <td>{$row['Genre']}</td>
                            <td>{$row['Price']}</td>
                            <td>{$row['Stock']}</td>
                            <td>
                                <a href='update.php?id={$row['BookID']}' class='btn btn-warning btn-sm'>Update</a>
                                <a href='delete.php?id={$row['BookID']}' class='btn btn-danger btn-sm'>Delete</a>
                            </td>
                        </tr>";
                    }
                } else {
                    echo "<tr><td colspan='7'>No books found</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>
