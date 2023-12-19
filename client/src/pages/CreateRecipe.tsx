import { useState} from 'react';
import axios from 'axios';
import useGetUserID from '../hooks/useGetUserID';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"])

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients:[] as Array<string>,
    instructions:"",
    imageUrl:"",
    cookingTime:0,
    userOwner: userID
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipe({...recipe, [name]: value})
  }

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>,index:number) => {
    const { value } = e.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({...recipe, ingredients})
  }

  const addIngredient = () => {
    setRecipe({...recipe, ingredients:[...recipe.ingredients,""]});
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      await axios.post("http://localhost:3001/recipes", recipe,{headers:{authorization: cookies.access_token}});
      alert("Recipe Created!");
      navigate("/");
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className='create-recipe'>
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={recipe.name} onChange={handleChange} />
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={recipe.description} onChange={(e) => setRecipe({...recipe,description:e.target.value})}></textarea>
        <label htmlFor="ingredients">Ingredients</label>
        {
          recipe.ingredients.map((ingredient, index) => (
            <input 
              key={index} 
              type="text" 
              name="ingredients" 
              value={ingredient}
              onChange={(e) => handleIngredientChange(e,index)}
            />
          ))
        }
        <button onClick={addIngredient} type="button">Add Ingredient</button>
        <label htmlFor="instructions">Instructions</label>
        <textarea name="instructions" id="instructions" value={recipe.instructions} onChange={(e) => setRecipe({...recipe,instructions:e.target.value})}></textarea>
        <label htmlFor="imageUrl">Image URL</label>
        <input type="text" id="imageUrl" name="imageUrl" value={recipe.imageUrl} onChange={handleChange}/>
        <label htmlFor="cookingTime">Cooking Time(minutes)</label>
        <input type="number" id="cookingTime" name="cookingTime" value={recipe.cookingTime} onChange={handleChange}/>
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  )
}

export default CreateRecipe