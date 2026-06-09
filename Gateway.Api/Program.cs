using Gateway.Api.Data;
using Gateway.Api.Repositories.Implementations;
using Gateway.Api.Repositories.Interfaces;
using Gateway.Api.Services.Implementation;
using Gateway.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Gateway.Api.Middlewares;
using Microsoft.Extensions.Configuration.UserSecrets;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication("Bearer").AddBearerToken("Bearer", opt =>
{
    opt.BearerTokenExpiration = new TimeSpan(1, 0, 0); // Default token expires in hours
    opt.RefreshTokenExpiration = new TimeSpan(3, 0, 0, 0); // Refresh token expires in days
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "SpecificOrigins", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddDbContext<PgDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ILogRepository, LogRepository>();
builder.Services.AddScoped<ILogService, LogService>();

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("SpecificOrigins");

app.UseHttpsRedirection();
app.UseForwardedHeaders();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<AuthTokenMiddleware>();
app.UseMiddleware<RequestLoggerMiddleware>();

app.MapReverseProxy();
app.MapControllers();

// MOCKED ENDPOINTS
// Products ---------------------------->
app.Map("/products/getProducts", () =>
{
    List<object> products = new List<object>
    {
        new
        {
            productId = 1001,
            productName = "Laptop Pro X",
            price = 1299.99,
            category = "Electronics",
            inStock = true
        },
        new
        {
            productId = 1002,
            productName = "Wireless Mouse",
            price = 29.99,
            category = "Accessories",
            inStock = true
        },
        new
        {
            productId = 1003,
            productName = "Mechanical Keyboard",
            price = 89.99,
            category = "Accessories",
            inStock = false
        }
    };
});

app.Map("/products/getProduct/{id}", (int id) =>
{
    switch (id)
    {
        case 1001:
            return new
            {
                productId = 1001,
                productName = "Laptop Pro X",
                price = 1299.99,
                category = "Electronics",
                inStock = true
            };
        case 1002:
            return new
            {
                productId = 1002,
                productName = "Wireless Mouse",
                price = 29.99,
                category = "Accessories",
                inStock = true
            };
        case 1003:
            return new
            {
                productId = 1003,
                productName = "Mechanical Keyboard",
                price = 89.99,
                category = "Accessories",
                inStock = false
            };
        default:
            return new
            {
                productId = 1002,
                productName = "Wireless Mouse",
                price = 29.99,
                category = "Accessories",
                inStock = true
            };
    }
});

// Orders ---------------------------->
app.Map("/orders/getOrders", () =>
{
    List<object> orders = new List<object>
    {
        new
        {
            orderId = 5001,
            customerName = "John Doe",
            totalAmount = 245.50,
            status = "Shipped",
            orderDate = "2024-01-15"
        },
        new
        {
            orderId = 5002,
            customerName = "Jane Smith",
            totalAmount = 89.99,
            status = "Processing",
            orderDate = "2024-01-16"
        },
        new
        {
            orderId = 5003,
            customerName = "Bob Johnson",
            totalAmount = 1299.99,
            status = "Delivered",
            orderDate = "2024-01-14"
        }
    };
});

app.Map("/orders/getOrder/{id}", (int id) =>
{
    switch (id)
    {
        case 5001:
            return new
            {
                orderId = 5001,
                customerName = "John Doe",
                totalAmount = 245.50,
                status = "Shipped",
                orderDate = "2024-01-15"
            };
        case 5002:
            return new
            {
                orderId = 5002,
                customerName = "Jane Smith",
                totalAmount = 89.99,
                status = "Processing",
                orderDate = "2024-01-16"
            };
        case 5003:
            return new
            {
                orderId = 5003,
                customerName = "Bob Johnson",
                totalAmount = 1299.99,
                status = "Delivered",
                orderDate = "2024-01-14"
            };
        default:
            return new
            {
                orderId = 5002,
                customerName = "Jane Smith",
                totalAmount = 89.99,
                status = "Processing",
                orderDate = "2024-01-16"
            };
    }
});

// Employees ---------------------------->
app.Map("/employees/getEmployees", () =>
{
    List<object> employees = new List<object>
    {
        new
        {
            employeeId = 201,
            firstName = "Sarah",
            lastName = "Johnson",
            position = "Software Engineer",
            department = "IT",
            salary = 85000
        },
        new
        {
            employeeId = 202,
            firstName = "Michael",
            lastName = "Chen",
            position = "Product Manager",
            department = "Product",
            salary = 95000
        },
        new
        {
            employeeId = 203,
            firstName = "Emily",
            lastName = "Rodriguez",
            position = "UX Designer",
            department = "Design",
            salary = 72000
        }
    };
});

app.Map("/employees/getEmployee/{id}", (int id) =>
{
    switch (id)
    {
        case 201:
            return new
            {
                employeeId = 201,
                firstName = "Sarah",
                lastName = "Johnson",
                position = "Software Engineer",
                department = "IT",
                salary = 85000
            };
        case 202:
            return new
            {
                employeeId = 202,
                firstName = "Michael",
                lastName = "Chen",
                position = "Product Manager",
                department = "Product",
                salary = 95000
            };
        case 203:
            return new
            {
                employeeId = 203,
                firstName = "Emily",
                lastName = "Rodriguez",
                position = "UX Designer",
                department = "Design",
                salary = 72000
            };
        default:
            return new
            {
                employeeId = 202,
                firstName = "Michael",
                lastName = "Chen",
                position = "Product Manager",
                department = "Product",
                salary = 95000
            };
    }
});

// Posts ---------------------------->
app.Map("/posts/getPosts", () =>
{
    List<object> posts = new List<object>
    {
        new
        {
            postId = 1,
            title = "Getting Started with .NET",
            author = "TechGuru",
            likes = 156,
            published = true
        },
        new
        {
            postId = 2,
            title = "10 Tips for Clean Code",
            author = "CodeMaster",
            likes = 89,
            published = true
        },
        new
        {
            postId = 3,
            title = "Understanding Microservices",
            author = "DevExpert",
            likes = 234,
            published = false
        }
    };
});

app.Map("/posts/getPost/{id}", (int id) =>
{
    switch (id)
    {
        case 1:
            return new
            {
                postId = 1,
                title = "Getting Started with .NET",
                author = "TechGuru",
                likes = 156,
                published = true
            };
        case 2:
            return new
            {
                postId = 2,
                title = "10 Tips for Clean Code",
                author = "CodeMaster",
                likes = 89,
                published = true
            };
        case 3:
            return new
            {
                postId = 3,
                title = "Understanding Microservices",
                author = "DevExpert",
                likes = 234,
                published = false
            };
        default:
            return new
            {
                postId = 1,
                title = "Getting Started with .NET",
                author = "TechGuru",
                likes = 156,
                published = true
            };
    }
});

// Webhook ---------------------------->
app.MapPost("/webhook", async context =>
{    
    var requestBody = await context.Request.ReadFromJsonAsync<object>();
    Console.WriteLine($"Payload: {requestBody}");
 
    context.Response.StatusCode = 200;
    await context.Response.WriteAsync("Webhook acknowledged");
});

app.Run();