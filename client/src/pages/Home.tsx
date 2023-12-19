import { useState, useEffect } from 'react';
import axios from 'axios';
import useGetUserID from '../hooks/useGetUserID';
import { useCookies } from 'react-cookie';

type RecipeType = {
  name:string,
  userOwner:string,
  imageUrl:string,
  ingredients:string[],
  instructions:string,
  cookingTime:number,
  __v:number,
  _id:string
}

const Home = () => {
  const [ recipes, setRecipes] = useState<RecipeType[]>([]);
  const [ savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [cookies, _] = useCookies(["access_token"])
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipe = async () => {
      try{
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data)
      }catch(err){
        console.error(err);
      }
    };

    const fetchSavedRecipe = async () => {
      try{
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
        setSavedRecipes(response.data.savedRecipes)
      }catch(err){
        console.error(err);
      }
    };
    fetchRecipe();
    if(cookies.access_token) fetchSavedRecipe();
  },[recipes,userID]);

  const saveRecipe = async (recipeID:string) => {
    try{
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {recipeID,userID},
        {headers:{authorization: cookies.access_token}});
      setSavedRecipes(response.data.savedRecipes);
    }catch(err){
      console.error(err);
    }
  }

  const isRecipeSaved = (id:string) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {
          Array.isArray(recipes) && recipes.map((recipe) => (
            <li key={recipe._id}>
              <div>
                <h2>{recipe.name}</h2>
                <button 
                  onClick={() => saveRecipe(recipe._id)}
                  disabled={isRecipeSaved(recipe._id)}  
                >
                  { isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                </button>
              </div>
              <div className='instructions'>
                <p>{recipe.instructions}</p>
              </div>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <p>Cooking Time: { recipe.cookingTime}(minutes)</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Home