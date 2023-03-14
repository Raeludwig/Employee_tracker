SELECT department.movie_name AS movie, role.review
FROM role
LEFT JOIN department
ON role.movie_id = department.id
ORDER BY department.movie_name;
