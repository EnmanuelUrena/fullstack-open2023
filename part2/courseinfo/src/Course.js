const Course = ({courses}) => (
    <div>
      {courses.map(({name, parts, id}) => {
        return(
            <div key={id}>
                <Header name={name} />
                <Content parts={parts} />
                <Total parts={parts} />
            </div>
        )
      })}
    </div>
)

const Header = ({ name }) => <h2>{name}</h2>;

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part, id) => (
        <Part key={id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Total = ({ parts }) => <p><b>total of {parts.reduce((acc, curr) => acc + curr.exercises, 0)} exercises</b></p>

export default Course