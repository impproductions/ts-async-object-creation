# Asynchronous Object Creation
A utility to instantiate objects that need to wait for asynchronous operations in their construction. I don't think this has any practical use, I made it more as an exercise than anything else.

## Target Functionality
I'm aware of the [object readiness pattern](https://pdconsec.net/blogs/devnull/asynchronous-constructor-design-pattern), but I wanted a pattern that could satisfy different criteria:

- To have a single instruction when creating the object
- To be able to call it as a static method of the object
- To have a base class handling the asynchronous creation and inherit from that
- The child class to be as agnostic as possible in regards to the creation, allowing the user to safely extend it even without previous knowledge of how the parent works
- To share parameter names and typing (and autocomplete) between the constructor and whatever function/method I was going to use for instantiation
- To rewrite the least possible amount of code when creating new classes

These can't all be satisfied using the readiness pattern, or a factory function/object, which, while being much more sensible methods to achieve the same result, would have a different syntax from the one I was looking for in this exercise, i.e.:

```typescript
let asyncFoo: Promise<Foo> = Foo.createAsync(/*constructor params*/);
```

## Implementation
Playground: [click me](https://www.typescriptlang.org/play?#code/PQKhCgAIUhBBnAngOwMYAsBOB7Z2Cu8k2ARgFYCmqALpKphQIbUCWuk122ANlDACroKkEo3jCEKVAHlyVWqkbIRwigA9qFZABMK2jtkjol27sLFSsuAkXpNWuPpADuLaugK0GAB3stkAOZ02LqQJi7oLGaQ3gzimABu-kGoIcKpALbeZg7KAGbYmBxCwcjw1Jj4NIV8wOBQqNxiRACqrNxuLBREAN5QkAOgEAMjMADqjG5EBUUA2rpNiAC6YTqQcTwJ3TE4GSziLm7oYZDIFM6QCYzc+BT9o5AAAt6MmIwZkAuMiJD3AyB1EaQcrMFioMJINCQPIUagYMZHAAiFEWAAovogAFynfAZEgUTAASmxAAVdvsKAAecqYZIAPkgfSBQOAwEghGEnGBLAy+Camk+KO+kH80NhGGSn2YjHqzJGOUu11ukAAvJAAOQwuFCbTqgDcsrlkFZ61h+EwyjJ2D24gAdAxKDRUWcLgBRTA4TCogBEimQ6oUDGYnJ5BO9hMJeuNbPwaGtGS0tC5mnKpsduUNcoY1HNyhdkCtNqpNPpqNRG24W0JqoZTKNQNSZR4FFt3GwAR9IMwmn0WolgSl1EYYVo3sgAGpTudIIjg6jCbbOAAZbCKMwAZQqyXnkb+9fE1H4oc8ZerKtre-rI0b8GbrfbPry-n2OrF2sl2mlI8gY8n+dnmjzou2ArmuFCbrSgQ7gaV5GhWWyolcNwULusEDAAvgANIKiyoUa6G7n86HgMR4BDE46iaGsXIBJMygWGgVh4IQdBBrkdCMC8JBRG4iBOO46SRNw+iNM0Iq2LgNJVD2IrKAJEJSAAwpJFTSWwygJu4IS-NAdSMCQNKMDQdBNPARCSGgsjpoyfwmgeMSvO8sIEkQooSsJpRSdUmB-DeqnefONn1iaz6sNcLAAF7CLE2C+N2XSuco7kiSplTeURmbGmAe4wAAklkZgJsgtC4NwPwMRgODMRJZT+exsUEqCklGASLaQII6SmUQMVxaw2zwB4fL6PismdOFUXaDlsnFMIDABHyryeXVNTMgCfz6YZxkVcptVpZwXq2odrwBPA2JKIgsxLMSBbkuIlIJNgLDaHSmUhbVShhQK8mkNZ4TZrmIq0KKw4xUWfwgqw4IVax9gUBZqCUiSkCUVo2hEOdl3YfwyMaKj5mQjIcg0HSqLuPs2L5qih22sdp0FmeDL8Nh1O06S1Z1nKJqEIwAQUNisyKUJ2hLLadjBvDqK04Sl6DGy8nHbiibowwM3Ak5ELFNgBwxUkuj6KK8nJUte01DL0Yw8GxBE0D71oHc9YKv4IJ26qU4XGT8BU0dmAnYRwVsmu3AKWgO1efVyhO0OLvhM4bzeID00g7d9tGgqoMUq7kdKKgLbbal0mFJLPvwAuAnIGWcR8tQDNBWh-0WrJzs5zB+ELoo2plgSRI1rXsE3neXeF13toJmZPMoS3sHuDgFz5u6no+vDxtqeweSTGY2jYr+yMeiP3TwOPeFygRBpmya9dySU6fiPrts52bF87NaFKT5AxGkSaKbUOAolmXABOCyiPoFGOh8ZSCsvIXuMR8AkA6OCX+8ArS9R+Gqb0hQWABH8Ncb0r9vAwLgW+DAegkEEmoCgn8ug15VxwebLk8AeQLQFMODE00+yRAHJ+Ic34-J7XUq9NkYgADW0JCgOTeJpFyOlrz5wCi8cR2ISyBHZmbeA+A4rzlfg2SSd42wdnVJQxgVcTJiR6qQn4SFbjYnVBOYo+xRZdRId2RAR9mT9zMPePRBijGcAALT4h8WwvQT9kGKmQlYmxHtbSBO0I4shfsjRvTGh0KKwTSEJWmjwguPl6yRIQbE8hcj3iv1IiyNkPJsgUCKrQCqTEbDL3SkCPBsCwTByhgAmR+15ykmTpSc6F5-bcl5PyYQbCPxflcO4E4GIzYKjYQAJW6EYtUbQeJ9XgFE8U6AETuGRGiAATAABiOaXIQ5dyyLO4NXHuHMryROifk12ldLmaJGARUWzAMCdw9DXG59Y3EtkHl6Yeo8D68xcTkqws9pzz0Lr6Ag3AdABkIccJ51BwwvIwvErMZoG7zIudQYpJF6gmjFgKH6kDwgZCUCwPBwyE64Bzo3KOn11LiU+LgO4Jo8BfWMLQQpEjMASQKrCVl+xIBUv8EOfwQSZiqyNgg6ahs2JwwJuK2EHhJoKgqhA4yap4aAOEqLZVEtvQZBCCwJ8ehwyLlOWWLOdsfm+W0e43RPoFWmKcaE5UbllW3ybnzH8Nj7U53sc0fJLj-keMfJsoJHqyFeuED62Gfqo45y3kGu+LZ7k4GQS4x+waKAGjee3T5qIu6Oq0U2dxgKy27xBYfV+09sBQrdB6WFqQhr+htkkyKwhyU0HRSRSMQA)

Please note that:
- Since the user will extend the base AsyncObject class, everything is handled under the hood
- The asyncConstructor method is abstract, so the compiler will force the user to implement it even if they don't know anything about how the base class works
- The arguments for the creatAsync() method are the same as the child class constructor, and intellisense is preserved, so the user can inherit from the base class with almost no knowledge and additional work required

## Purpose
I don't think this has any practical use in production.