# Configuração do domínio oficial

Domínio oficial do projeto:

```text
fabcampo.com.br
```

Repositório:

```text
https://github.com/paulocunha1009/Portal-da-Comunidade
```

Site atual do GitHub Pages:

```text
https://paulocunha1009.github.io/Portal-da-Comunidade/
```

---

## 1. Arquivo CNAME

Para o GitHub Pages reconhecer o domínio oficial, a raiz do repositório deve ter um arquivo chamado `CNAME`.

Conteúdo do arquivo:

```text
fabcampo.com.br
```

Esse arquivo já foi criado na raiz do projeto.

---

## 2. Configuração no GitHub

No GitHub:

1. Acesse o repositório `paulocunha1009/Portal-da-Comunidade`.
2. Entre em **Settings**.
3. Clique em **Pages**.
4. Em **Custom domain**, coloque:

```text
fabcampo.com.br
```

5. Clique em **Save**.
6. Aguarde o GitHub verificar o domínio.
7. Quando disponível, marque **Enforce HTTPS**.

---

## 3. Configuração DNS do domínio

No painel onde o domínio `fabcampo.com.br` foi registrado, configure os registros abaixo.

### Domínio raiz

Crie quatro registros do tipo `A` para `fabcampo.com.br`:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Versão com www

Crie um registro do tipo `CNAME`:

```text
www.fabcampo.com.br -> paulocunha1009.github.io
```

Não coloque `/Portal-da-Comunidade` no DNS. O CNAME do `www` deve apontar apenas para `paulocunha1009.github.io`.

---

## 4. Testes depois da propagação

No PowerShell, confira:

```powershell
Resolve-DnsName fabcampo.com.br -Type A
Resolve-DnsName www.fabcampo.com.br -Type CNAME
```

O domínio pode levar até 24 horas para propagar.

Quando estiver correto, o site deve abrir em:

```text
https://fabcampo.com.br
```

E a versão abaixo deve redirecionar corretamente:

```text
https://www.fabcampo.com.br
```
