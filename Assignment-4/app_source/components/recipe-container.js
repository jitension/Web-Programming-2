const RecipeContainer = React.createClass({
    getInitialState: function () {
        return { recipes: [] };
    },

    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (recipeList) => {
                this.setState({ recipes: recipeList });
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    },

    handleAddRecipe: function (Recipe) {
        let tempRecipe = Recipe;
        if (!tempRecipe.title || tempRecipe.ingredients.length == 0 || !tempRecipe.description || tempRecipe.steps == 0) {
            alert("Something is missing");
            return;
        }

        for (let i = 0; i < this.state.recipes.length; i++) {
            if (this.state.recipes[i].title == tempRecipe.title) {
            //  return  this.props.duplicateTitle("duplicate title");
                alert("Duplicate title");
                return;
            }

        }
        {
            let recipes = this
                .state
                .recipes
                .concat(Recipe);

            $.ajax({
                url: this.props.url,
                type: 'POST',
                dataType: 'json',
                data: Recipe,
                cache: false,
                success: (recipeList) => {
                    this.setState({ recipes: recipes });
                },
                error: (xhr, status, err) => {
                    console.error(this.props.url, status, err.toString());
                }
            });
        }
    },

    render: function () {
        return (
            <div className="recipe">
                <RecipeList recipes={this.state.recipes} />
                <hr />
                <RecipeForm addRecipes={this.handleAddRecipe.bind(this)} />
            </div>
        );
    }
});
