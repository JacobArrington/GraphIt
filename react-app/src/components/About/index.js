import './about.css'


const About = () =>{

    return (
        <div className='about'>
        <h2>Created by Jacob Arrington</h2>
        <h4> 
          for more great projects follow me on
        </h4>
        <ul className='Social'>
          <li>
            <a href="https://www.linkedin.com/in/jacob-arrington-190885278/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
              
            </a>
          </li>
          <li>
            <a href="https://wellfound.com/u/jacob-arrington-1" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-angellist"></i>
              
            </a>
          </li>
          <li>
            <a href="https://github.com/JacobArrington" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
              
            </a>
          </li>
        </ul>
      </div>
    )
}
export default About;
