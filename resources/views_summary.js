# ./resources/views/sessions/new.edge

@extends('layouts/application')

@section('title', 'Connexion')

@section('content')
	<h1>Connexion</h1>
	@if(flashMessages.get('error'))
		<div class="alert alert-danger">{{ flashMessages.get('error') }}</div>
	@endif
	<form method="POST" action="{{ route('SessionsController.login') }}">
		@csrf
		<div>
			<label>Email</label>
			<input type="email" name="email" required>
		</div>
		<div>
			<label>Mot de passe</label>
			<input type="password" name="password" required>
		</div>
		<button type="submit">Se connecter</button>
	</form>
	<a href="{{ route('RegistrationsController.showRegisterForm') }}">Créer un compte</a>
@endsection

# ./resources/views/admin/plants/edit.edge

@extends('layouts/application')

@section('title', 'Modifier plante')

@section('content')
	<h1>Modifier la plante</h1>
	@include('admin/plants/_form', { plant: plant, action: route('Admin/PlantsController.update', { id: plant.id }), method: 'PUT' })
@endsection

# ./resources/views/admin/plants/new.edge

@extends('layouts/application')

@section('title', 'Nouvelle plante')

@section('content')
	<h1>Créer une plante</h1>
	@include('admin/plants/_form', { plant: null, action: route('Admin/PlantsController.store'), method: 'POST' })
@endsection

# ./resources/views/admin/plants/index.edge

@extends('layouts/application')

@section('title', 'Gestion des plantes')

@section('content')
	<h1>Plantes (admin)</h1>
	<a href="{{ route('Admin/PlantsController.create') }}">Nouvelle plante</a>
	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th>Prix</th>
				<th>Stock</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			@each(plant in plants)
				<tr>
					<td>{{ plant.name }}</td>
					<td>{{ plant.price }} €</td>
					<td>{{ plant.stock }}</td>
					<td>
						<a href="{{ route('Admin/PlantsController.edit', { id: plant.id }) }}">Modifier</a>
						<form method="POST" action="{{ route('Admin/PlantsController.destroy', { id: plant.id }) }}" style="display:inline">
							@csrf
							@method('DELETE')
							<button type="submit" onclick="return confirm('Supprimer cette plante ?')">Supprimer</button>
						</form>
					</td>
				</tr>
			@endeach
		</tbody>
	</table>
@endsection

# ./resources/views/admin/plants/_form.edge

<form method="POST" action="{{ action }}">
	@csrf
	@if(method !== 'POST')
		@method(method)
	@endif
	<div>
		<label>Nom</label>
		<input type="text" name="name" value="{{ plant ? plant.name : '' }}" required>
	</div>
	<div>
		<label>Prix (€)</label>
		<input type="number" name="price" value="{{ plant ? plant.price : '' }}" min="0" step="0.01" required>
	</div>
	<div>
		<label>Description</label>
		<textarea name="description" required>{{ plant ? plant.description : '' }}</textarea>
	</div>
	<div>
		<label>Stock</label>
		<input type="number" name="stock" value="{{ plant ? plant.stock : '' }}" min="0" required>
	</div>
	<button type="submit">Enregistrer</button>
</form>

# ./resources/views/admin/users/show.edge

@layout('layouts/application')

@section('content')
<h1>Détail utilisateur</h1>
<ul>
	<li>ID : {{ user.id }}</li>
	<li>Nom : {{ user.name }}</li>
	<li>Email : {{ user.email }}</li>
	<li>Admin : {{ user.admin ? 'Oui' : 'Non' }}</li>
</ul>
<a href="{{ route('admin.users.edit', {id: user.id}) }}">Modifier</a>
@endsection

# ./resources/views/admin/users/edit.edge

@layout('layouts/application')

@section('content')
<h1>Modifier l’utilisateur</h1>
<form method="POST" action="{{ route('admin.users.update', {id: user.id}) }}">
	@csrf
	<input type="hidden" name="_method" value="PUT">
	<label>Nom : <input type="text" name="name" value="{{ user.name }}"></label><br>
	<label>Email : <input type="email" name="email" value="{{ user.email }}"></label><br>
	<label>Admin : <input type="checkbox" name="admin" {{ user.admin ? 'checked' : '' }}></label><br>
	<button type="submit">Valider</button>
</form>
@endsection

# ./resources/views/admin/users/index.edge

@layout('layouts/application')

@section('content')
<h1>Liste des utilisateurs</h1>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Nom</th>
			<th>Email</th>
			<th>Admin</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		@each(user in users)
		<tr>
			<td>{{ user.id }}</td>
			<td>{{ user.name }}</td>
			<td>{{ user.email }}</td>
			<td>{{ user.admin ? 'Oui' : 'Non' }}</td>
			<td>
				<a href="{{ route('admin.users.show', {id: user.id}) }}">Afficher</a>
				<a href="{{ route('admin.users.edit', {id: user.id}) }}">Modifier</a>
			</td>
		</tr>
		@endeach
	</tbody>
</table>
@endsection

# ./resources/views/plants/show.edge

@layout('layouts/application')

@section('content')
<h1>{{ plant.name }}</h1>
<p>{{ plant.description }}</p>
<p>Prix : {{ plant.price }} €</p>
<p>Stock : {{ plant.stock }}</p>
@if(auth.user)
<form method="POST" action="{{ route('carts.create') }}">
	@csrf
	<input type="hidden" name="plant_id" value="{{ plant.id }}">
	<button type="submit">Ajouter au panier</button>
</form>
@endif
@endsection

# ./resources/views/plants/edit.edge

@layout('layouts/application')

@section('content')
<h1>Modifier la plante</h1>
<form method="POST" action="{{ route('plants.update', {id: plant.id}) }}">
	@csrf
	<input type="hidden" name="_method" value="PUT">
	<label>Nom : <input type="text" name="name" value="{{ plant.name }}"></label><br>
	<label>Description : <textarea name="description">{{ plant.description }}</textarea></label><br>
	<label>Prix : <input type="number" step="0.01" name="price" value="{{ plant.price }}"></label><br>
	<label>Stock : <input type="number" name="stock" value="{{ plant.stock }}"></label><br>
	<button type="submit">Mettre à jour</button>
</form>
@endsection

# ./resources/views/plants/index.edge

<h1 class="text-center mb-4">🌿 Liste des Plantes</h1>
@if(auth.user && auth.user.admin)
	<a href="{{ route('Admin/PlantsController.create') }}" class="btn btn-info mb-3">Nouvelle Plante</a>
@endif
<div class="row">
	@each(plant in plants)
	<div class="col-md-4">
		<div class="card mb-4 shadow-sm">
			<div class="card-body">
				<h5 class="card-title">
					<a href="{{ route('plants.show', {id: plant.id}) }}" class="text-decoration-none text-dark">{{ plant.name }}</a>
				</h5>
				<p class="card-text">
					<strong>Prix :</strong> {{ plant.price }} €<br>
					@if(auth.user && auth.user.admin)
						<strong>Stock :</strong> {{ plant.stock }} unités
					@endif
				</p>
				<button class="btn btn-success w-100"
					onclick="cartInstance.add({{ plant.id }}, '{{ plant.name }}', {{ plant.price }}, {{ plant.stock }})">
					Ajouter au panier
				</button>
			</div>
		</div>
	</div>
	@endeach
</div>

# ./resources/views/orders/new.edge

@layout('layouts/application')

@section('content')
<h1>Nouvelle commande</h1>
<form method="POST" action="{{ route('orders.create') }}">
	@csrf
	<p>Valider votre commande ?</p>
	<button type="submit">Commander</button>
</form>
@endsection

# ./resources/views/orders/_order_card.edge

<div>
	<p>Commande #{{ order.id }} - {{ order.totalPrice }} €</p>
	<p>Status : {{ order.status }}</p>
</div>

# ./resources/views/orders/index.edge

@layout('layouts/application')

@section('content')
<h1>Mes commandes</h1>
@if(orders.length === 0)
	<p>Aucune commande trouvée.</p>
@else
<ul>
	@each(order in orders)
	<li>
		Commandé le {{ order.createdAt.toLocaleDateString('fr-FR') }} -
		{{ order.totalPrice }} €
		({{ order.status }})
	</li>
	@endeach
</ul>
@endif
@endsection

# ./resources/views/orders/create.edge

@layout('layouts/application')

@section('content')
<h1>Commande créée</h1>
<p>Votre commande a bien été enregistrée.</p>
<a href="{{ route('orders.index') }}">Retour à mes commandes</a>
@endsection

# ./resources/views/layouts/_flash_messages.edge

@if(flashMessages.all())
	@each(key in flashMessages.keys())
		<div class="flash-{{ key }}">{{ flashMessages.get(key) }}</div>
	@endeach
@endif

# ./resources/views/layouts/application.edge

<!DOCTYPE html>
<html>
<head>
	<title>@!section('title', 'PlantShop')</title>
</head>
<body>
	@include('layouts/_flash_messages')
	@include('layouts/_navbar')
	<main>
		@!section('content')
	</main>
</body>
</html>

# ./resources/views/layouts/_navbar.edge

<ul class="navbar-nav ms-auto">
	@!auth.user
	<li class="nav-item">
		<a class="nav-link" href="{{ route('login') }}">Se connecter</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" href="{{ route('register') }}">Créer un compte</a>
	</li>
	@end
	@auth.user
	<li class="nav-item">
		<a class="nav-link" href="{{ route('users.show') }}">{{ auth.user.username }}</a>
	</li>
	<li class="nav-item">
		<form method="POST" action="{{ route('logout') }}">
			@csrf
			<button type="submit" class="btn btn-link nav-link">Se déconnecter</button>
		</form>
	</li>
	@end
</ul>

# ./resources/views/errors/unauthorized.edge

<p> It's a 403 </p>

# ./resources/views/errors/server-error.edge

<p> It's a 500 </p>

# ./resources/views/errors/not-found.edge

<p> It's a 404 </p>

# ./resources/views/users/show.edge

@extends('layouts/application')

@section('title', 'Mon profil')

@section('content')
	<h1>Profil</h1>
	<p><strong>Nom :</strong> {{ user.name }}</p>
	<p><strong>Email :</strong> {{ user.email }}</p>
	<a href="{{ route('UsersController.edit', { id: user.id }) }}">Modifier</a>
@endsection

# ./resources/views/users/edit.edge

@extends('layouts/application')

@section('title', 'Modifier mon profil')

@section('content')
	<h1>Modifier le profil</h1>
	<form method="POST" action="{{ route('UsersController.update', { id: user.id }) }}">
		@csrf
		@method('PUT')
		<div>
			<label>Nom</label>
			<input type="text" name="name" value="{{ user.name }}" required>
		</div>
		<div>
			<label>Email</label>
			<input type="email" name="email" value="{{ user.email }}" required>
		</div>
		<button type="submit">Mettre à jour</button>
	</form>
@endsection

