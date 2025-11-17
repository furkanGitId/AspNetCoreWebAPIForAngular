using AspNetCoreWebAPIForAngular.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreWebAPIForAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly StudentDbContext _context;
        public StudentsController(StudentDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetStudents()
        {
            var students = _context.Students.ToList();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public IActionResult GetStudent(int id)
        {
            if(ModelState.IsValid)
            {
                var student = _context.Students.Find(id);
                if (student == null)
                {
                    return NotFound();
                }
                return Ok(student);
            }
            return BadRequest(ModelState);

        }

        [HttpPost]
        public IActionResult AddStudent([FromBody] Student student)
        {
            if (ModelState.IsValid)
            {
                _context.Students.Add(student);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateStudent(int id, [FromBody] Student student)
        {
            if (ModelState.IsValid)
            {
                var existingStudent = _context.Students.Find(id);
                if (existingStudent == null)
                {
                    return NotFound();
                }
                existingStudent.name = student.name;
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(int id)
        {
            if (ModelState.IsValid)
            {
                var student = _context.Students.Find(id);
                if (student == null)
                {
                    return NotFound();
                }
                _context.Students.Remove(student);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest(ModelState);

        }

    }
}
