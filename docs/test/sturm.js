const RELERROR = 1.0e-12;   /* smallest relative error we want */
const MAXPOW = 32;        /* max power of 10 we wish to search to */
const MAXIT = 800;       /* max number of iterations */
const SMALL_ENOUGH = 1.0e-12;   /* a coefficient smaller than SMALL_ENOUGH
                                 * is considered to be zero (0.0). */

/* structure type for representing a polynomial */
function poly() {
    this.order;
    this.coef = [Maxdegree + 1];
}

/*---------------------------------------------------------------------------
 * evalpoly
 *
 * evaluate polynomial defined in coef returning its value.
 *--------------------------------------------------------------------------*/

function evalpoly (ord, coef, x) {
   let fp = coef[ord];
   let f = fp;

   for (fp--; fp >= coef; fp--)
      f = x * f + fp;

   return(f);
}

function modrf_pos(ord, coef, a, b, val, invert) {
    let its;
    let fx, lfx;
    let fp;
    let scoef = coef;
    let ecoef = coef[ord];
    let fa, fb;

    // Invert the interval if required
    if (invert) {
        let temp = a;
        a = 1.0 / b;
        b = 1.0 / temp;
    }

    // Evaluate the polynomial at the end points
    if (invert) {
        fb = fa = scoef;
        for (fp = scoef + 1; fp <= ecoef; fp++) {
            fa = a * fa + fp;
            fb = b * fb + fp;
        }
    }
    else {
        fb = fa = ecoef;
        for (fp = ecoef - 1; fp >= scoef; fp--) {
            fa = a * fa + fp;
            fb = b * fb + fp;
        }
    }

    // if there is no sign difference the method won't work
    if (fa * fb > 0.0)
    return(0);

    // Return if the values are close to zero already
    if (Math.abs(fa) < RELERROR) {
        val = invert ? 1.0/a : a;
        return(1);
    }

    if (Math.abs(fb) < RELERROR) {
        val = invert ? 1.0/b : b;
        return(1);
    }

    lfx = fa;

    for (its = 0; its < MAXIT; its++) {
        // Assuming straight line from a to b, find zero
        let x = (fb * a - fa * b) / (fb - fa);

        // Evaluate the polynomial at x
        if (invert) {
            fx = scoef;
            for (fp = scoef + 1; fp <= ecoef; fp++)
            fx = x * fx + fp;
        }
        else {
            fx = ecoef;
            for (fp = ecoef - 1; fp >= scoef; fp--)
            fx = x * fx + fp;
        }

        // Evaluate two stopping conditions
        if (Math.abs(x) > RELERROR && Math.abs(fx/x) < RELERROR) {
            val = invert ? 1.0/x : x;
            return(1);
        }
        else if (Math.abs(fx) < RELERROR) {
            val = invert ? 1.0/x : x;
            return(1);
        }

        // Subdivide region, depending on whether fx has same sign as fa or fb
        if ((fa * fx) < 0){
            b = x;
            fb = fx;
            if ((lfx * fx) > 0)
            fa /= 2;
        }
        else {
            a = x;
            fa = fx;
            if ((lfx * fx) > 0)
            fb /= 2;
        }


        // Return if the difference between a and b is very small
        if (Math.abs(b-a) < Math.abs(RELERROR * a)) {
            val = invert ? 1.0/a : a;
            return(1);
        }

        lfx = fx;
    }

    //==================================================================
    // This is debugging in case something goes wrong.
    // If we reach here, we have not converged -- give some diagnostics
    //==================================================================

    // Evaluate the true values at a and b
    if (invert) {
        fb = fa = scoef;
        for (fp = scoef + 1; fp <= ecoef; fp++) {
            fa = a * fa + fp;
            fb = b * fb + fp;
        }
    }
    else {
        fb = fa = ecoef;
        for (fp = ecoef - 1; fp >= scoef; fp--){
            fa = a * fa + fp;
            fb = b * fb + fp;
        }
    }

    return(0);
}

/*---------------------------------------------------------------------------
 * modrf
 *
 * uses the modified regula-falsi method to evaluate the root
 * in interval [a,b] of the polynomial described in coef. The
 * root is returned is returned in *val. The routine returns zero
 * if it can't converge.
 *--------------------------------------------------------------------------*/

function modrf (ord, coef, a, b, val) {
     // This is an interfact to modrf that takes account of different cases
     // The idea is that the basic routine works badly for polynomials on
     // intervals that extend well beyond [-1, 1], because numbers get too large

     let fp;
     let scoef = coef;
     let ecoef = coef[ord];
     const invert = 1;

     let fp1= 0.0, fm1 = 0.0; // Values of function at 1 and -1
     let fa = 0.0, fb  = 0.0; // Values at end points

     // We assume that a < b
     if (a > b) {
         let temp = a;
         a = b;
         b = temp;
     }

     // The normal case, interval is inside [-1, 1]
     if (b <= 1.0 && a >= -1.0) return modrf_pos (ord, coef, a, b, val, !invert);

     // The case where the interval is outside [-1, 1]
     if (a >= 1.0 || b <= -1.0)
     return modrf_pos (ord, coef, a, b, val, invert);

     // If we have got here, then the interval includes the points 1 or -1.
     // In this case, we need to evaluate at these points

     // Evaluate the polynomial at the end points
     for (fp = ecoef - 1; fp >= scoef; fp--) {
         fp1 = fp + fp1;
         fm1 = fp - fm1;
         fa = a * fa + fp;
         fb = b * fb + fp;
     }

     // Then there is the case where the interval contains -1 or 1
     if (a < -1.0 && b > 1.0) {
         // Interval crosses over 1.0, so cut
         if (fa * fm1 < 0.0)      // The solution is between a and -1
         return modrf_pos (ord, coef, a, -1.0, val, invert);
         else if (fb * fp1 < 0.0) // The solution is between 1 and b
         return modrf_pos (ord, coef, 1.0, b, val, invert);
         else                     // The solution is between -1 and 1
         return modrf_pos(ord, coef, -1.0, 1.0, val, !invert);
     }
     else if (a < -1.0) {
         // Interval crosses over 1.0, so cut
         if (fa * fm1 < 0.0)      // The solution is between a and -1
         return modrf_pos (ord, coef, a, -1.0, val, invert);
         else                     // The solution is between -1 and b
         return modrf_pos(ord, coef, -1.0, b, val, !invert);
     }
     else {
          // b > 1.0
         if (fb * fp1 < 0.0) // The solution is between 1 and b
         return modrf_pos (ord, coef, 1.0, b, val, invert);
         else                     // The solution is between a and 1
         return modrf_pos(ord, coef, a, 1.0, val, !invert);
     }
}

/*---------------------------------------------------------------------------
 * modp
 *
 *  calculates the modulus of u(x) / v(x) leaving it in r, it
 *  returns 0 if r(x) is a constant.
 *  note: this function assumes the leading coefficient of v is 1 or -1
 *--------------------------------------------------------------------------*/

function modp(u, v, r) {
   let j, k;  /* Loop indices */

   let nr = r.coef;
   let end = u.coef[u.ord];

   let uc = u.coef;
   while (uc <= end) {
       nr++ = uc++;
   }

   if (v.coef[v.ord] < 0.0) {

      for (k = u.ord - v.ord - 1; k >= 0; k -= 2)
         r.coef[k] = -r.coef[k];

      for (k = u.ord - v.ord; k >= 0; k--)
         for (j = v.ord + k - 1; j >= k; j--)
            r.coef[j] = -r.coef[j] - r.coef[v.ord + k]
         * v.coef[j - k];
      } else {
         for (k = u.ord - v.ord; k >= 0; k--)
            for (j = v.ord + k - 1; j >= k; j--)
               r.coef[j] -= r.coef[v.ord + k] * v.coef[j - k];
      }

   k = v.ord - 1;
   while (k >= 0 && Math.abs(r.coef[k]) < SMALL_ENOUGH) {
       r.coef[k] = 0.0;
       k--;
   }

   r.ord = (k < 0) ? 0 : k;

   return(r.ord);
}

/*---------------------------------------------------------------------------
 * buildsturm
 *
 * build up a sturm sequence for a polynomial in smat, returning
 * the number of polynomials in the sequence
 *--------------------------------------------------------------------------*/

function buildsturm(ord, sseq) {
   sseq[0].ord = ord;
   sseq[1].ord = ord - 1;

   /* calculate the derivative and normalise the leading coefficient */
   {
       let i;    // Loop index
       let sp;
       let f = Math.abs(sseq[0].coef[ord] * ord);
       let fp = sseq[1].coef;
       let fc = sseq[0].coef + 1;

       for (i=1; i<=ord; i++)
       fp++ = fc++ * i / f;

       /* construct the rest of the Sturm sequence */
       for (sp = sseq + 2; modp(sp - 2, sp - 1, sp); sp++) {

           /* reverse the sign and normalise */
           f = -Math.abs(sp.coef[sp.ord]);
           for (fp = sp.coef[sp.ord]; fp >= sp.coef; fp--)
           fp /= f;
       }

       sp.coef[0] = -sp.coef[0]; /* reverse the sign */

       return(sp - sseq);
   }
}

/*---------------------------------------------------------------------------
 * numchanges
 *
 * return the number of sign changes in the Sturm sequence in
 * sseq at the value a.
 *--------------------------------------------------------------------------*/

function numchanges(np, sseq, a) {
   let changes = 0;

   let lf = evalpoly(sseq[0].ord, sseq[0].coef, a);

   let s;
   for (s = sseq + 1; s <= sseq + np; s++) {
       let f = evalpoly(s.ord, s.coef, a);
       if (lf == 0.0 || lf * f < 0)
       changes++;
       lf = f;
   }

   return(changes);
}

/*---------------------------------------------------------------------------
 * numroots
 *
 * return the number of distinct real roots of the polynomial described in sseq.
 *--------------------------------------------------------------------------*/

function numroots(np, sseq, atneg, atpos, non_neg) {
   let atposinf = 0;
   let atneginf = 0;

   /* changes at positive infinity */
   let f;
   let lf = sseq[0].coef[sseq[0].ord];

   let s;
   for (s = sseq + 1; s <= sseq + np; s++) {
      f = s.coef[s.ord];
      if (lf == 0.0 || lf * f < 0)
         atposinf++;
      lf = f;
    }

   // changes at negative infinity or zero
   if (non_neg)
      atneginf = numchanges(np, sseq, 0.0);

   else
      {
      if (sseq[0].ord & 1)
         lf = -sseq[0].coef[sseq[0].ord];
      else
         lf = sseq[0].coef[sseq[0].ord];

      for (s = sseq + 1; s <= sseq + np; s++) {
         if (s.ord & 1)
            f = -s.coef[s.ord];
         else
            f = s.coef[s.ord];
         if (lf == 0.0 || lf * f < 0)
            atneginf++;
         lf = f;
         }
      }

   atneg = atneginf;
   atpos = atposinf;

   return(atneginf - atposinf);
}


/*---------------------------------------------------------------------------
 * sbisect
 *
 * uses a bisection based on the sturm sequence for the polynomial
 * described in sseq to isolate intervals in which roots occur,
 * the roots are returned in the roots array in order of magnitude.
 *--------------------------------------------------------------------------*/

function sbisect(np, sseq, min, max, atmin, atmax, roots) {
   let mid;
   let atmid;
   let its;
   let  n1 = 0, n2 = 0;
   let nroot = atmin - atmax;

   if (nroot == 1) {

       /* first try a less expensive technique.  */
       if (modrf(sseq.ord, sseq.coef, min, max, &roots[0]))
       return 1;

       /*
       * if we get here we have to evaluate the root the hard
       * way by using the Sturm sequence.
       */
       for (its = 0; its < MAXIT; its++) {
           mid = (double) ((min + max) / 2);
           atmid = numchanges(np, sseq, mid);

           if (Math.abs(mid) > RELERROR) {
               if (Math.abs((max - min) / mid) < RELERROR) {
                   roots[0] = mid;
                   return 1;
               }
           } else if (Math.abs(max - min) < RELERROR) {
               roots[0] = mid;
               return 1;
           }

           if ((atmin - atmid) == 0)
           min = mid;
           else
           max = mid;
       }

       if (its == MAXIT) {
           roots[0] = mid;
       }

       return 1;
   }

   /* more than one root in the interval, we have to bisect */
   for (its = 0; its < MAXIT; its++) {

      mid = (double) ((min + max) / 2);
      atmid = numchanges(np, sseq, mid);

      n1 = atmin - atmid;
      n2 = atmid - atmax;

      if (n1 != 0 && n2 != 0) {
          sbisect(np, sseq, min, mid, atmin, atmid, roots);
          sbisect(np, sseq, mid, max, atmid, atmax, &roots[n1]);
          break;
      }

      if (n1 == 0)
         min = mid;
      else
         max = mid;
      }

      if (its == MAXIT) {
          for (n1 = atmax; n1 < atmin; n1++)
          roots[n1 - atmax] = mid;
      }

   return 1;
}

function find_real_roots_sturm(p, order, roots, nroots, non_neg) {
           /*
           * finds the roots of the input polynomial.  They are returned in roots.
           * It is assumed that roots is already allocated with space for the roots.
           */

           let sseq[Maxdegree+1];
           let  min, max;
           let  i, nchanges, np, atmin, atmax;

           // Copy the coefficients from the input p.  Normalize as we go
           let norm = 1.0 / p[order];
           for (i=0; i<=order; i++)
           sseq[0].coef[i] =  p[i] * norm;

           // Now, also normalize the other terms
           let val0 = Math.abs(sseq[0].coef[0]);
           let fac = 1.0; // This will be a factor for the roots
           if (val0 > 10.0) {
               // Do this in case there are zero roots
               fac = Math.pow(val0, -1.0/order);
               let mult = fac;
               for (let i=order-1; i>=0; i--) {
                   sseq[0].coef[i] *= mult;
                   mult = mult * fac;
               }
           }

           /* build the Sturm sequence */
           np = buildsturm(order, sseq);
           // get the number of real roots
           nroots = numroots(np, sseq, &atmin, &atmax, non_neg);

           if (nroots == 0) {
               // fprintf(stderr, "solve: no real roots\n");
               return 0 ;
           }

           /* calculate the bracket that the roots live in */
           if (non_neg) min = 0.0;
           else {
               min = -1.0;
               nchanges = numchanges(np, sseq, min);
               for (i = 0; nchanges != atmin && i != MAXPOW; i++) {
                   min *= 10.0;
                   nchanges = numchanges(np, sseq, min);
               }

               if (nchanges != atmin) {
                   atmin = nchanges;
               }
           }

           max = 1.0;
           nchanges = numchanges(np, sseq, max);
           for (i = 0; nchanges != atmax && i != MAXPOW; i++) {
               max *= 10.0;
               nchanges = numchanges(np, sseq, max);
           }

           if (nchanges != atmax) {
               atmax = nchanges;
           }

           nroots = atmin - atmax;

           /* perform the bisection */
           sbisect(np, sseq, min, max, atmin, atmax, roots);

           /* Finally, reorder the roots */
           for (i=0; i < nroots; i++) {
               roots[i] /= fac;
           }

           return 1;
}
