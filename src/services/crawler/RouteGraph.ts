/**
 * RouteGraph.ts
 * Manages the hierarchical route representation (sitemap tree).
 */

export interface RouteNode {
  id: string;
  url: string;
  parent: string | null;
  children: string[];
}

export class RouteGraph {
  private nodes: Map<string, RouteNode> = new Map();
  private rootId: string | null = null;

  /**
   * Clears the graph.
   */
  clear() {
    this.nodes.clear();
    this.rootId = null;
  }

  /**
   * Adds a page node to the graph and binds parent-child relations.
   */
  addNode(url: string, parentUrl: string | null = null): RouteNode {
    const id = this.urlToId(url);
    const parentId = parentUrl ? this.urlToId(parentUrl) : null;

    if (!this.rootId && !parentId) {
      this.rootId = id;
    }

    if (!this.nodes.has(id)) {
      this.nodes.set(id, {
        id,
        url,
        parent: parentId,
        children: []
      });
    }

    const node = this.nodes.get(id)!;

    // Connect with parent
    if (parentId && this.nodes.has(parentId)) {
      const parentNode = this.nodes.get(parentId)!;
      if (!parentNode.children.includes(id)) {
        parentNode.children.push(id);
      }
      node.parent = parentId;
    }

    return node;
  }

  /**
   * Builds a tree from a list of discovered pages.
   * Assumes URLs discovered first are parent directories/roots.
   */
  buildFromList(urls: string[]) {
    this.clear();
    if (urls.length === 0) return;

    // Sort by path length to process roots first
    const sorted = [...urls].sort((a, b) => {
      const pathA = new URL(a).pathname;
      const pathB = new URL(b).pathname;
      return pathA.split('/').length - pathB.split('/').length || pathA.length - pathB.length;
    });

    // Add root
    const rootUrl = sorted[0];
    this.addNode(rootUrl, null);

    // Add others and locate their parents
    for (let i = 1; i < sorted.length; i++) {
      const url = sorted[i];
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.replace(/\/$/, '');
      const parts = pathname.split('/').filter(Boolean);

      let foundParent = false;
      // Try to find the closest ancestor already in the graph
      for (let depth = parts.length - 1; depth >= 0; depth--) {
        const parentPath = '/' + parts.slice(0, depth).join('/');
        const parentUrlObj = new URL(url);
        parentUrlObj.pathname = parentPath;
        const candidateParent = parentUrlObj.toString();
        const candidateParentWithSlash = candidateParent.replace(/\/$/, '') + '/';

        const parentNode = this.findMatchingNode([candidateParent, candidateParentWithSlash]);
        if (parentNode) {
          this.addNode(url, parentNode.url);
          foundParent = true;
          break;
        }
      }

      if (!foundParent) {
        // Fallback to the root node if no parent path matches
        this.addNode(url, rootUrl);
      }
    }
  }

  /**
   * Finds a node by matching any of the candidate URLs.
   */
  private findMatchingNode(candidates: string[]): RouteNode | null {
    for (const cand of candidates) {
      const id = this.urlToId(cand);
      if (this.nodes.has(id)) {
        return this.nodes.get(id)!;
      }
    }
    return null;
  }

  /**
   * Translates a URL into a clean ID.
   */
  private urlToId(url: string): string {
    try {
      const urlObj = new URL(url);
      let clean = urlObj.pathname + urlObj.search;
      if (clean === '') clean = '/';
      return clean;
    } catch {
      return url;
    }
  }

  /**
   * Returns all nodes in the sitemap.
   */
  getAllNodes(): RouteNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Gets the root node.
   */
  getRoot(): RouteNode | null {
    return this.rootId ? this.nodes.get(this.rootId) || null : null;
  }

  /**
   * Exports sitemap hierarchy.
   */
  toSitemapJson() {
    return {
      rootId: this.rootId,
      nodes: this.getAllNodes().map(n => ({
        id: n.id,
        url: n.url,
        parent: n.parent,
        children: n.children
      }))
    };
  }
}
