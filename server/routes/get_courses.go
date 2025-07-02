package routes

import (
	"qb_pdf/config"
	"qb_pdf/functions"

	"github.com/gin-gonic/gin"
)

type Courses struct {
	Id     *string `json:"course_code"`
	Course *string `json:"course_name"`
}

func GetAllCourses(c *gin.Context) {
	data := []Courses{}
	row, err := config.Database.Query(`SELECT course_code,course_name FROM aca_courses ac 
									  LEFT JOIN m_users mu ON mu.id = ac.course_coordinator 
									  INNER JOIN m_departments d ON d.id = ac.course_dept
									   INNER JOIN aca_regulation ar ON ar.id = ac.regulation WHERE ac.status = '1' AND ar.status='1'`)
	if err != nil {
		functions.Response(c, 500, err.Error(), nil)
	}

	for row.Next() {
		var temp Courses
		row.Scan(&temp.Id, &temp.Course)
		data = append(data, temp)
	}

	functions.Response(c, 200, "", map[string]interface{}{"data": data})
}
