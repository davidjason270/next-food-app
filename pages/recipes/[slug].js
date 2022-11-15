import {sanityClient, urlFor, UsePreviewSubscription} from "../../lib/sanity"
import {PortableText} from '@portabletext/react'
import {UseRouter} from 'next/router'
import {UseState} from "react"; 
const query = `*[_type=="recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
}`;

export default function oneRecipe({data, preview}){

    const router = UseRouter();

    if(router.isFallback){
        return <div>Loading...</div>;
    }

    const { data: recipe } = UsePreviewSubscription(query, {
        params : {slug: data.recipe?.slug.current},
        initialData: data,
        enabled: preview,
    });

    const [likes, setLikes] = UseState(data?.recipe?.likes);
    
    const addLike = async () => {
        const res = await fetch("/api/handle-like", {
            method: "POST",
            body: JSON.stringify({ _id: recipe._id }),
        }).catch((error) => console.log(error));
        
        const data = await res.json();
        setLikes(data.likes);
    };
    
    // const { recipe } = data;

    // console.log(data);
    
    return (
        <article className="recipe">
            <h1>{recipe.name}</h1>
            <button onClick={addLike} className="like-button">{likes} ❤</button>
            <main className="content">
                {recipe.mainImage && (
                    <Image
                    src={urlFor(recipe.mainImage).url()}
                    className="w-10 h-10 rounded-full"
                    alt=""
                    />
                )}
                <div className="breakdown">
                    <ul className="ingredients">
                        {recipe.ingredient?.map((ingredient) => (
                        <li key={ingredient._key} className="ingridient">
                            {ingredient?.wholeNumber}
                            {ingredient?.fraction}
                            {ingredient?.unit}
                            {" "}
                            <br />
                            {ingredient?.ingredient?.name}
                        </li>
                        ))}
                    </ul>
                    <PortableText className="instructions" value={recipe?.instructions} />
                </div>
            </main>
        </article>
    );
}

export async function getStaticPaths()
{
    const paths = await sanityClient.fetch(
        `*[_type == "recipe" && defined(slug.current)]{
            "params":{
                "slug":slug.current
            }
        }`
    );

    return {
        paths,
        fallback:true,
    };
}

export async function getStaticProps({ params })
{
    const {slug} = params;
    const recipe = await sanityClient.fetch(query, {slug});
    return { props: { data: { recipe }, preview:true } };
}